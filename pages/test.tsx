import { ReactElement } from "react";


export default function Test(): ReactElement {
    throw new Error('Hallo Dominic');
    return <div className={'wrapper'}>

        <video width={'150px'} loop autoPlay muted>
            <source src={'/draftmodels_none.mov'} type="video/quicktime" />
            <source src={'/arcwarden_300.webm'} type="video/webm" />
        </video>

        <style jsx global>{`
            .wrapper { 
                height: 100%;
                width: 100%;
                left:0;
                right: 0;
                top: 0;
                bottom: 0;
                position: absolute;
                background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
                background-size: 1800% 1800%;
                animation: rainbow 18s ease infinite;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @keyframes rainbow { 
                0%{background-position:0% 82%}
                50%{background-position:100% 19%}
                100%{background-position:0% 82%}
            }    
        `}</style>
    </div>
}
