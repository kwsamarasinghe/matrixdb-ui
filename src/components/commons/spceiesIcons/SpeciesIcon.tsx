import React from 'react';
import { ReactComponent as DefaultIcon } from './icons/default.svg';
import { ReactComponent as HumanIcon } from '../../../assets/images/species/human_bullet.svg';
import { ReactComponent as MouseIcon } from '../../../assets/images/species/mouse_bullet.svg';
import { ReactComponent as RatIcon } from '../../../assets/images/species/rat_bullet.svg';
import { ReactComponent as BovineIcon } from '../../../assets/images/species/bovine_bullet.svg';
import { ReactComponent as FishIcon } from '../../../assets/images/species/fish_bullet.svg';
import { ReactComponent as GuineaPigIcon } from '../../../assets/images/species/guineapig_bullet.svg';
import { ReactComponent as ChickenIcon } from '../../../assets/images/species/chicken_bullet.svg';
import { ReactComponent as PigIcon } from '../../../assets/images/species/pig_bullet.svg';
import { ReactComponent as RabbitIcon } from '../../../assets/images/species/rabbit_bullet.svg';


interface SpeciesIconProps {
    speciesId: string;
}

const SpeciesIcon: React.FC<SpeciesIconProps> = ({ speciesId }) => {
    let iconComponent;

    switch (speciesId) {
        case '9606':
            iconComponent = <HumanIcon />;
            break;
        case '10090':
            iconComponent = <MouseIcon />;
            break;
        case '10114':
            iconComponent = <RatIcon />;
            break;
        case '9913':
            iconComponent = <BovineIcon />;
            break;
        case 'fish':
            iconComponent = <FishIcon />;
            break;
        case '10141':
            iconComponent = <GuineaPigIcon />;
            break;
        case '9031':
            iconComponent = <ChickenIcon />;
            break;
        case '9986':
            iconComponent = <RabbitIcon />;
            break;
        case '9823':
            iconComponent = <PigIcon />;
            break;
        default:
            iconComponent = null;
    }

    return <>{iconComponent}</>;
};

export default SpeciesIcon;
