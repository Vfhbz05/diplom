export async function request (url, method = 'GET', data = null){

    const BASE_URL = 'http://localhost:5000'; 

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
    };

    if(data){
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);

    if(!response.ok){
        return { error: `Ошибка сервера`};
    }

    try{
        return await response.json();
    } catch{
        return { error: 'Не удалось прочитать ответ сервера' }
    }
}