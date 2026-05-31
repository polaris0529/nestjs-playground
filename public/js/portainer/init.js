const portainerApi = new Proxy({}, {
    get: (_target, prop, _receiver) => {
        return async (params = {}, method = 'POST') => {
            try {
                const response = await axios({
                    method,
                    url: `/portainer/${prop}`,
                    headers: { 'Content-Type': "application/json" },
                    timeout: 5000,
                    data: JSON.stringify(params)
                });
                return response.data;
            } catch (err) {
                console.error(err);
                return { result: [] };
            }
        };
    },
    set: () => false
});

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        try {
            drawLayout();
        } catch (error) {
            console.error(error);
        }
    }
});

function normalizeValue(value) {
    if (value === null || value === undefined) return '-';

    if (Array.isArray(value)) {
        return value.map(el =>
            typeof el === 'object' ? JSON.stringify(el) : String(el)
        ).join('<br>');
    }

    if (typeof value === 'object') {
        return Object.entries(value)
            .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
            .join('<br>');
    }

    return String(value);
}

async function drawLayout() {

    const { result = [] } = await portainerApi.getContainer();

    const formattedData = _.map(result, (item) => {
        const transformed = {};
        for (const key in item) {
            transformed[key] = normalizeValue(item[key]);
        }
        return transformed;
    });

    new DataTable('#containerAccordion', {
        data: formattedData,
        paging: false,
        layout: {},
        searching: false,
        destroy: true,
        columns: [
            {
                title: "컨테이너명",
                data: "Names",
                render: (data) => {
                    console.log(data.startsWith("/"));
                    data = data.startsWith("/") ? data.substring(1) : data;
                    return data;
                }
            },
            { title: "이미지", data: "Command", visible: false },
            { title: "HostConfig", data: "HostConfig", visible: false },
            { title: "Id", data: "Id", visible: false },
            { title: "Image", data: "Image", visible: true },
            { title: "ImageID", data: "ImageID", visible: false },
            { title: "Mounts", data: "Mounts", visible: false },
            { title: "Labels", data: "Labels", visible: false },
            { title: "NetworkSettings", data: "NetworkSettings", visible: false },
            { title: "포트", data: "Ports", visible: true },
            {
                title: "State",
                data: { State: "State", Id: "Id" },
                render: (data) => {
                    const { State, Id } = data;
                    const btnClass = (State === "running") ? "btn-primary" : "btn-secondary"

                    return `<button type="button"  class="btn ${btnClass} action-btn"  data-id="${Id}" data-state="${State}">${State}</button>`;
                }

            },
            { title: "상태", data: "Status", visible: false },
            {
                title: "Created",
                data: "Created",
                visible: false,
                render: (data) => {
                    const timestamp = Number(data);
                    return isNaN(timestamp) ? '-' : new Date(timestamp * 1000).toLocaleString();
                }
            }
        ]
    });
}

$(document).on('click', '.action-btn', async function () {

    const state = $(this).data('state');
    const containerId = $(this).data('id');

    const endpoint = (state === "running")
        ? 'stopContainer'
        : 'startContainer';


    try {

        const response = await axios({
            method: "post",
            url: `/portainer/${endpoint}`,
            titmeout: 5000,
            data: { CONTAINER_ID: containerId }            
        })

        drawLayout();


    } catch (err) {
        const { status, data } = err.response;
        console.error(`콘솔 메세지 : ${data.message}`);
    }
});