import Vertex from "@/API/DataModels/GraphRepresentation/Vertex";

class Graph {
  public nodes: Map<string, Vertex>;

  constructor() {
    this.nodes = new Map();
  }

  addVertex(value: string): Vertex {
    if (this.nodes.has(value)) {
      // @ts-ignore
      return this.nodes.get(value);
    }
    const vertex = new Vertex(value);
    this.nodes.set(value, vertex);
    return vertex;
  }

  // unused
  removeVertex(value: string) {
    const current = this.nodes.get(value); // <1>
    if (current) {
      Array.from(this.nodes.values()).forEach((node) =>
        node.removeAdjacent(current)
      ); // <2>
    }
    return this.nodes.delete(value); // <3>
  }

  addEdge(source: string, destination: string) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);
    sourceNode.addAdjacent(destinationNode);
    return [sourceNode, destinationNode];
  }

  // unused
  removeEdge(source: string, destination: string) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);
    }
    return [sourceNode, destinationNode];
  }

  // unused
  areAdjacents(source: string, destination: string) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      return sourceNode.isAdjacent(destinationNode);
    }

    return false;
  }

  /**
   * Orders Vertexes "hierarchically", meaning the entities with NO incoming Edges, but at least one outgoing,
   * are at the top.
   *
   * @returns Array<Vertex>[] A bi-dimensional array of Vertexes, each 1D index is a new row they should be displayed on
   *
   * TODO: Improve algorithm
   *  - Order each Vertexes in the rows to minimize crossing edges
   *  - Make it recursive
   *  - handle complete graphs independently
   */
  orderHierarchically(): Array<Vertex>[] {
    if (!this.nodes.size) return [];

    if (this.nodes.size === 1) return [Array.from(this.nodes.values())];

    // group les ID par "ligne" en fonction de leur nombre de liens
    // (entrants/references ou sortant/adjacents)
    const groupedByAdjCount: Map<number, string[]> = new Map();
    this.nodes.forEach((vertex) => {
      // special treatment for vertex with only outgoing links
      if (vertex.adjacents.size && !vertex.references.size) {
        groupedByAdjCount.set(
          Infinity,
          groupedByAdjCount.has(Infinity)
            ? // @ts-ignore
              [...groupedByAdjCount.get(Infinity), vertex.value]
            : [vertex.value]
        );
      } else {
        groupedByAdjCount.set(
          vertex.adjacents.size + vertex.references.size,
          groupedByAdjCount.has(vertex.adjacents.size + vertex.references.size)
            ? [
                ...groupedByAdjCount.get(
                  vertex.adjacents.size + vertex.references.size
                ),
                vertex.value,
              ]
            : [vertex.value]
        );
      }
    });

    const _layers = Array.from(groupedByAdjCount.keys())
      .sort((a, b) => (a >= b ? -1 : 1))
      .reduce((acc: Vertex[][], curr) => {
        if (groupedByAdjCount.has(curr)) {
          // @ts-ignore
          acc.push(groupedByAdjCount.get(curr).map((v) => this.nodes.get(v)));
        }
        return acc;
      }, []);

    return _layers;
  }

  /**
   * Groups inner-circle nodes (2 or more links, incoming or outgoing)
   * Groups outer-circle nodes (a single link to/from an "inner-circle" entity)
   * Groups isolated pairs (2 nodes linked to each other by 1 link only)
   * Groups fully isolated nodes (0 link)
   *
   * TODO:
   *  - handle complete graphs independently
   */
  orderCircularly() {
    const result: {
      innerCircle: Map<string, Vertex>;
      outerCircle: Map<string, Vertex[]>;
      isolated: Map<string, Vertex>;
      isolatedDuos: Array<Vertex>;
    } = {
      innerCircle: new Map(),
      outerCircle: new Map(),
      isolated: new Map(),
      isolatedDuos: [],
    };

    if (!this.nodes.size) return result;

    if (this.nodes.size === 1) {
      result.innerCircle = this.nodes;
      return result;
    }

    const visitedNode = new Map();
    this.nodes.forEach((curr, key) => {
      if (visitedNode.has(curr.value)) return;

      if (curr.references.size + curr.adjacents.size >= 2)
        result.innerCircle.set(key, curr);
      else {
        // 0 link
        if (!curr.adjacents.size && !curr.references.size)
          result.isolated.set(key, curr);
        // 1 link, either to inner Circle or "isolated" duo
        else {
          const associatedVertex: Vertex = curr.adjacents.size
            ? curr.adjacents.values().next().value
            : curr.references.values().next().value;
          // connected to inner circle
          if (
            associatedVertex.adjacents.size +
              associatedVertex.references.size >=
            2
          ) {
            const ref = result.outerCircle.get(associatedVertex.value);
            if (ref) ref.push(curr);
            else result.outerCircle.set(associatedVertex.value, [curr]);
          } else {
            result.isolatedDuos.push(curr);
            result.isolatedDuos.push(associatedVertex);
            visitedNode.set(associatedVertex.value, associatedVertex);
          }
        }
      }
      visitedNode.set(curr.value, curr);
    });
    return result;
  }
}

export default Graph;
