import React from 'react';
import IconProps from './IconProps';
import './Icons.css';

export default function Lock(props: IconProps) {
    return (
        <div className="icon lock">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 24 24"
                height="24"
                viewBox="0 0 24 24"
                width="24"
            >
                <g>
                    <path d="M0,0h24v24H0V0z" fill="none" />
                </g>
                <g>
                    <path
                        fill={props.fill}
                        d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M9,8V6c0-1.66,1.34-3,3-3s3,1.34,3,3v2H9z"
                    />
                </g>
            </svg>
        </div>
    );
}
