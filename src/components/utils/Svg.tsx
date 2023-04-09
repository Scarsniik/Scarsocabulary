import React, { useState, useEffect } from 'react';

interface Props {
  src: string;
  className?: string;
}

const Svg: React.FC<Props> = ({ src, className }) => {
    const [state, setState] = useState({
        svg: '',
        properties: {} as any,
        content: '',
    });

    const parseSVG = (svgText: any) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        // Set viewBox and preserveAspectRatio
        if (!svgElement.getAttribute('viewBox')) {
            svgElement.setAttribute('viewBox', '0 0 24 24');
        }
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Remove unnecessary tags
        const symbols = svgDoc.getElementsByTagName('symbol');
        while (symbols.length > 0) {
            (symbols[0]as any).parentNode.removeChild(symbols[0]);
        }
        
        // Update the properties
        const properties = {};
        for (let i = 0; i < svgElement.attributes.length; i++) {
            const attribute = svgElement.attributes[i];
            (properties as any)[attribute.name] = attribute.value;
        }

        // Get the content
        const content = svgElement.innerHTML;

        return { properties, content };
    };

    useEffect(() => {
        async function fetchSvg() {
            const response = await fetch(src);
            const svg = await response.text();
            const { properties, content } = parseSVG(svg);
            setState({
                svg,
                properties,
                content,
            });
        }
        fetchSvg();
    }, [src]);

    return (
        <svg className={className} {...state.properties}>
            <g dangerouslySetInnerHTML={{ __html: state.content }}/>
        </svg>
    );
};

export default Svg;
