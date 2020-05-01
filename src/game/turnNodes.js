class Graph {
    constructor(){
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
    }
    addEdge(nodeA, nodeB, weight) {
        
    }
}

class TurnNode {
    constructor(x, y){
        this.x = x;
        this.y = y;

    }
}