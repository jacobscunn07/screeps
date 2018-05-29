import ICreep from './../../ICreep';

interface ICreepTypeStrategy {
    determine(): ICreep;
}

export default ICreepTypeStrategy;
