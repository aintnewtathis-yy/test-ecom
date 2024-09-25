/** @type {import('./$types').RequestHandler} */
export async function GET({request}) {
    console.log(request)
    
    const requestData = await request.json()
    
    console.log(requestData)
    return new Response();
};