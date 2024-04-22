import React from 'react';
import UniprotIcon from '../../../assets/images/uniprot.png';
import ChebiIcon from '../../../assets/images/chebi-logo.jpg';
import CPXIcon from '../../../assets/images/cpx-logo.png';
import MatrixdbIcon from '../../../assets/images/matrixdb_logo_medium.png';

import {faStarOfLife} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



interface LogoIconProps {
    logoName: string;
    width: string;
    height: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ logoName, width, height }) => {
    let iconPath;

    switch (logoName) {
        case 'uniprot':
            iconPath = UniprotIcon;
            break;
        case 'complex-portal':
            iconPath = CPXIcon;
            break;
        case 'chebi':
            iconPath = ChebiIcon;
            break;
        case 'matrixdb':
            iconPath = MatrixdbIcon;
            break;
        default:
            iconPath = null; // Handle case where no icon matches
            break;
    }

    return (
        <>
            {iconPath && (
                <img src={iconPath} alt={logoName} width={width} height={height} />
            )}
        </>
    );
};

export default LogoIcon;
