import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import Bush from './Bush';
import Tree from './Tree';
import Rock from './Rock';

export default class ObstacleSnapshot{
    //id
    i: number;
    //opacity
    o: number;
    //type
    t: string;

    constructor(obstacle: RoundObstacle | RectangleObstacle){
        this.i = obstacle.id;
        this.o = obstacle.getOpacity();
        //wall
        if(obstacle instanceof RectangleObstacle) this.t ='w';
        //bushes
        else if(obstacle instanceof Bush) this.t ='b';
        //tree
        else if(obstacle instanceof Tree) this.t ='t';
        //rock
        else if(obstacle instanceof Rock) this.t ='r';
    }
}