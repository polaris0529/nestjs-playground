require('reflect-metadata');
require('ts-node/register');
require('tsconfig-paths/register');

const fs = require('fs');
const path = require('path');
const { getMetadataArgsStorage } = require('typeorm');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const outputFile = path.join(root, 'docs', 'database-erd.mmd');

function walkEntityFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkEntityFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.entity.ts')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function loadEntities() {
  for (const file of walkEntityFiles(srcDir)) {
    require(file);
  }
}

function tableName(table) {
  return table.name || table.target.name;
}

function columnName(column) {
  return column.options.name || column.propertyName;
}

function columnType(column) {
  const optionType = column.options.type;

  if (typeof optionType === 'string') {
    return withLength(optionType, column.options.length);
  }

  if (optionType === String) {
    return withLength('varchar', column.options.length);
  }

  if (optionType === Number) {
    return 'integer';
  }

  if (optionType === Boolean) {
    return 'boolean';
  }

  if (optionType === Date || column.mode === 'createDate' || column.mode === 'updateDate') {
    return 'timestamp';
  }

  return 'varchar';
}

function withLength(type, length) {
  return length ? `${type}_${length}` : type;
}

function uniqueColumnNames(storage, target) {
  const names = new Set();

  for (const unique of storage.uniques.filter((item) => item.target === target)) {
    for (const propertyName of unique.columns) {
      const column = storage.columns.find(
        (item) => item.target === target && item.propertyName === propertyName,
      );
      names.add(column ? columnName(column) : propertyName);
    }
  }

  return names;
}

function foreignKeyColumnNames(storage, target) {
  return new Set(
    storage.joinColumns
      .filter((joinColumn) => joinColumn.target === target)
      .map((joinColumn) => joinColumn.name || joinColumn.propertyName),
  );
}

function columnMarkers(column, uniqueNames, foreignKeyNames) {
  const markers = [];
  const name = columnName(column);

  if (column.options.primary) {
    markers.push('PK');
  }

  if (foreignKeyNames.has(name)) {
    markers.push('FK');
  }

  if (uniqueNames.has(name)) {
    markers.push('UK');
  }

  return markers.join(', ');
}

function columnComment(column) {
  const comments = [];

  if (column.options.nullable) {
    comments.push('nullable');
  }

  if (column.options.default !== undefined) {
    comments.push(`default ${String(column.options.default)}`);
  }

  return comments.length > 0 ? ` "${comments.join(', ')}"` : '';
}

function relationLine(storage, tablesByTarget, relation) {
  if (relation.relationType !== 'many-to-one' && relation.relationType !== 'one-to-one') {
    return null;
  }

  const sourceTable = tablesByTarget.get(relation.target);
  const targetTable = tablesByTarget.get(relation.type());
  if (!sourceTable || !targetTable) {
    return null;
  }

  const joinColumns = storage.joinColumns.filter(
    (joinColumn) =>
      joinColumn.target === relation.target && joinColumn.propertyName === relation.propertyName,
  );
  const label = joinColumns.map((joinColumn) => joinColumn.name).filter(Boolean).join(', ');
  const cardinality = relation.relationType === 'one-to-one' ? '||--||' : '||--o{';

  return `  ${tableName(targetTable)} ${cardinality} ${tableName(sourceTable)} : "${label || relation.propertyName}"`;
}

function buildMermaid() {
  loadEntities();

  const storage = getMetadataArgsStorage();
  const tables = storage.tables
    .filter((table) => table.type === 'regular')
    .sort((a, b) => tableName(a).localeCompare(tableName(b)));
  const tablesByTarget = new Map(tables.map((table) => [table.target, table]));
  const lines = ['erDiagram'];

  for (const table of tables) {
    const uniqueNames = uniqueColumnNames(storage, table.target);
    const foreignKeyNames = foreignKeyColumnNames(storage, table.target);
    const columns = storage.columns.filter((column) => column.target === table.target);

    lines.push(`  ${tableName(table)} {`);
    for (const column of columns) {
      const markers = columnMarkers(column, uniqueNames, foreignKeyNames);
      const markerText = markers ? ` ${markers}` : '';
      lines.push(
        `    ${columnType(column)} ${columnName(column)}${markerText}${columnComment(column)}`,
      );
    }
    lines.push('  }');
  }

  const relations = storage.relations
    .map((relation) => relationLine(storage, tablesByTarget, relation))
    .filter((line) => line !== null)
    .sort();

  lines.push(...relations);
  lines.push('');

  return lines.join('\n');
}

function main() {
  const mermaid = buildMermaid();
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, mermaid);
  console.log(`ERD 생성됨: ${path.relative(root, outputFile)}`);
}

main();
