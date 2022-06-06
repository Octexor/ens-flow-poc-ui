type FlowProps = {
    name: string,
    dt: number,
    zdt: number,
    dPoints: number,
    iter: number,
    vib: number,
    withLogo: boolean
}

async function genFlow({name, dt, zdt, dPoints, iter, vib, withLogo}: FlowProps) {
    const usp = new URLSearchParams();
    usp.set("name", name);
    usp.set("dt", (dt/100)+'');
    usp.set("zdt", (zdt/100000)+'');
    usp.set("dp", dPoints+'');
    usp.set("i", iter+'');
    usp.set("v", vib+'');
    if(withLogo) usp.set("lg", "1");
    const url = `https://ens-flow-poc.herokuapp.com/render?${usp.toString()}`;

    const resp = await fetch(url);
    return resp.json();
}

export default genFlow;