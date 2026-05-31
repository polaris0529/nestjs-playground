const roleApi = new Proxy({ data: {} }, {
    get: function (target, prop, _receiver) {

        return (prop === 'data')
            ? target.data
            :

        async (params = {}, method = 'POST') => {
            try {

                const response = await axios({
                    method,
                    url: `/admin/role/${prop}`,
                    headers: {
                        'Content-Type': "application/json"
                    },
                    timeout: 5000,
                    data: JSON.stringify(params)
                });

                console.log(response);                

                target.data = { result } = response.data
                
            } catch (err) {
                console.error(err);
            }
        };

    },
    set: function (traget, prop, value) {


        console.log(`${String.toString(traget)}`);
        console.log('set 호출')

        if (prop === 'data') {
            target[prop] = value;
            drawLayout();
            return true;
        } else {
            return false;
        }

    }
});

document.addEventListener('readystatechange', async () => {
    if (document.readyState === 'complete') {
        try {
            roleApi.get();            
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

    //const { result = [] } = await roleApi.get();

    const result = roleApi.data;

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
            { title : "id", data : "id" , visble : true },
            { title :"ip_address" , data : "ip_address" , visible : true },            
            {
                title: "사용 여부",
                data: {
                    is_active: "is_active",
                    id : "id"
                },
                visible: true,
                render: (data) => {
                    let { is_active, id } = data;
                    
                    console.log(typeof is_active )
                    return (is_active === "true")
                        ? `<button onclick="roleApi.update({id : ${id} , is_active : false });">able</button>`
                        : `<button onclick="roleApi.update({id : ${id} , is_active : true, });">disable</button>`;
                }
            },
            { title :"created_at" , data : "created_at" , visible : true },
            { title :"updated_at" , data : "updated_at" , visible : false },
            { title :"created_by" , data : "created_by" , visible : true },
            { title: "updated_by", data: "updated_by", visible: false },
            { title: "description", data: "description", visible: true },
            
        ]
    });
}