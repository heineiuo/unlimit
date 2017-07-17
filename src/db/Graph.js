import levelgraph from 'levelgraph'

class Graph {
  constructor(db, options) {
    this.db = levelgraph(`${options.prefix}_graph`)
  }


}

export default Graph
