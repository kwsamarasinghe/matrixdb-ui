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
import { ReactComponent as DogIcon } from '../../../assets/images/species/dog_bullet.svg';
import { ReactComponent as SheepIcon } from '../../../assets/images/species/sheep_bullet.svg';
import { ReactComponent as FlavoBacterium } from '../../../assets/images/species/flavobacterium_bullet.svg';
import {faStarOfLife} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



interface SpeciesIconProps {
    speciesId: string;
    width: string;
    height: string;
}

const SpeciesIcon: React.FC<SpeciesIconProps> = ({ speciesId, width, height }) => {
    let iconComponent;

    switch (speciesId) {
        case '9606':
        case 'human':
            iconComponent = <HumanIcon width={width} height={height}/>;
            break;
        case '10090':
        case 'mouse':
            iconComponent = <MouseIcon width={width} height={height}/>;
            break;
        case '10114':
        case 'rat':
            iconComponent = <RatIcon width={width} height={height}/>;
            break;
        case '9913':
        case 'bovine':
            iconComponent = <BovineIcon width={width} height={height}/>;
            break;
        case '7955':
            iconComponent = <FishIcon width={width} height={height}/>;
            break;
        case '10141':
            iconComponent = <GuineaPigIcon width={width} height={height}/>;
            break;
        case '9031':
        case 'chick':
            iconComponent = <ChickenIcon width={width} height={height}/>;
            break;
        case '9986':
            iconComponent = <RabbitIcon width={width} height={height}/>;
            break;
        case '9823':
        case 'pig':
            iconComponent = <PigIcon width={width} height={height}/>;
            break;
        case '10116':
            iconComponent = <RatIcon width={width} height={height}/>;
            break;
        case '984':
            iconComponent = <FlavoBacterium width={width} height={height}/>;
            break;
        case '9615':
        case 'dog':
            iconComponent = <DogIcon width={width} height={height}/>;
            break;
        case '1758':
        case 'sheep':
            iconComponent = <SheepIcon width={width} height={height}/>;
            break;
        default:
            iconComponent = <FontAwesomeIcon
                icon={faStarOfLife}
                width={width} height={height}
            />;
    }

    return <>{iconComponent}</>;
};

export default SpeciesIcon;
