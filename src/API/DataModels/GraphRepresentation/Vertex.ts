class Vertex {
  public value: string;

  public adjacents: Map<string, Vertex>;

  public references: Map<string, Vertex>;

  constructor(value: string) {
    this.value = value;
    this.adjacents = new Map();
    this.references = new Map();
  }

  addAdjacent(node: Vertex) {
    this.adjacents.set(node.value, node);
    node.references.set(this.value, this);
  }

  removeAdjacent(node: Vertex) {
    node.references.delete(this.value);
    return this.adjacents.delete(node.value);
  }

  isAdjacent(node: Vertex) {
    return this.adjacents.has(node.value);
  }
}

export default Vertex;
