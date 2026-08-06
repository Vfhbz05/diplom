export async function request (url, method = 'GET', data = null){

    const BASE_URL = 'http://localhost:5000'; 

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
    };

    options.credentials = 'include';

    if(data){
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);

    if(!response.ok){
        try {
            const errorData = await response.json();
            return { error: errorData.error || `Ошибка сервера (${response.status})` };
        } catch {
            return { error: `Ошибка сервера: ${response.statusText}` };
        }
    }

    try{
        return await response.json();
    } catch{
        return { error: 'Не удалось прочитать ответ сервера' }
    }
}