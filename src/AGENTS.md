# SRC KNOWLEDGE BASE

## OVERVIEW
NestJS application source: bootstrap, config, domain modules, shared cross-cutting code, migrations, and i18n resources.

## STRUCTURE

```text
src/
├── modules/        # auth, account, common-code, menu, admin, metrics
├── shared/         # decorators, exceptions, filters, guards, interceptors, middleware, types
├── config/         # app/typeorm/swagger config
├── database/       # TypeORM CLI data source and migrations
├── i18n/           # ko/en JSON translation namespaces
├── main.ts         # runtime bootstrap
└── app.module.ts   # module imports and middleware wiring
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Add a feature module | `src/modules/<feature>/` | Add controller/service/repository/module plus `dto/` and `entities/` when needed. |
| Register a feature | `src/app.module.ts` | Import only the completed module; do not place feature initialization logic here. |
| Add persistence | `src/modules/<feature>/*.repository.ts`, `entities/` | Repository wraps TypeORM; entity is registered by the feature module. |
| Add request validation | `dto/` | Validation messages should be i18n keys. |
| Add shared request behavior | `src/shared/middleware/`, `guards/`, `filters/`, `interceptors/` | Implement in its own file, wire in `main.ts` or `AppModule.configure()`. |
| Add translations | `src/i18n/ko/*.json`, `src/i18n/en/*.json` | Keep namespaces aligned across languages. |
| Add schema/seed changes | `src/database/migrations/` | Use `npm run migration:*`; do not rely on sync. |

## CONVENTIONS

- Keep dependency direction fixed: Controller -> Service -> Repository.
- Controllers handle HTTP shape only. Services orchestrate business flow. Repositories are the only TypeORM access point.
- `@InjectRepository` is allowed only inside repository classes.
- `main.ts` applies already-created objects: logger, filters, pipes, Swagger, hbs/static setup.
- `AppModule` imports configured modules and wires middleware; module-specific config belongs with that module/config file.
- `ConfigService` supplies runtime values. Never read secrets from literals in feature code.
- Entities must use explicit table names: `@Entity('<table>')`.
- Roles are common codes under `ROLE_TYPE`; JWT payload carries `roles`.
- Auth uses access/refresh JWT in httpOnly cookies; refresh rotates both tokens.
- CSRF double-submit is enforced on mutating requests except configured auth exemptions.

## ANTI-PATTERNS

- Do not make services depend on `Repository<Entity>` directly.
- Do not localize messages inside services; throw keys and let filters/controllers translate at the boundary.
- Do not create empty placeholder directories/files under `shared/`.
- Do not add action-style endpoints such as `createUser` or `deleteMenu`.
- Do not set `synchronize: true`.
- Do not add migrations outside `src/database/migrations/` unless the scripts are changed with it.
