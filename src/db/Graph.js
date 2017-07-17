import levelgraph from 'levelgraph'

class Graph {
  constructor(db) {
    this.db = levelgraph(db)
  }

}

export default Graph
