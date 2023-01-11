export function distanceFormula(
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}

export interface Rectangle {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
/**
 * Detect overlap between two rectangles (div, rect, etc...)
 * (not strict, meaning if they touch, we don't consider it an overlap)
 */
export function overlap(a: Rectangle, b: Rectangle) {
  // no horizontal overlap
  if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

  // no vertical overlap
  return !(a.y1 >= b.y2 || b.y1 >= a.y2);
}

export interface Coordinates2D {
  x: number;
  y: number;
}
export function pythagorean(sideA: number, sideB: number) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}
export function getVectorFromTwoPoints(
  start: Coordinates2D,
  end: Coordinates2D
) {
  return { x: end.x - start.x, y: end.y - start.y };
}

export function scalarProduct(v1: Coordinates2D, v2: Coordinates2D) {
  return v1.x * v2.x + v1.y * v2.y;
}

export function getVectorMagnitude(vector: Coordinates2D) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

export function addVectorToPoint(point: Coordinates2D, vector: Coordinates2D) {
  return { x: point.x + vector.x, y: point.y + vector.y };
}

export function getPerpendicularVector(
  vector: Coordinates2D,
  isClockwise = true
) {
  if (isClockwise) return { x: vector.y, y: -vector.x };
  return { x: -vector.y, y: vector.x };
}

export function getClockwiseAngleBetweenTwoVectorsInRadians(
  a: Coordinates2D,
  b: Coordinates2D
) {
  return Math.acos(
    scalarProduct(a, b) / (getVectorMagnitude(a) * getVectorMagnitude(b))
  );
}

export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function radToDeg(rad: number) {
  return rad / (Math.PI / 180);
}

export function pgcd(a: number, b: number): number {
  while (b > 0) {
    const r = a % b;
    a = b;
    b = r;
  }
  return a;
}

/**
 * Gets intersection Coordinates between two lines (**LINES**, not segments)
 * There will always be a solution unless they are parallel, in which case it will throw
 * @param start1  Starting point of the first segment
 * @param end1    Ending point of the first segment
 * @param start2  Starting point of the second segment
 * @param end2    Ending point of the second segment
 *
 * @returns Coordinates2D The point the lines intersect
 *
 * @throws Error If the two lines are parallel
 */
export function getIntersectionPointBetweenLines(
  start1: Coordinates2D,
  end1: Coordinates2D,
  start2: Coordinates2D,
  end2: Coordinates2D
): Coordinates2D {
  // down part of intersection point formula
  const d1 = (start1.x - end1.x) * (start2.y - end2.y); // (x1 - x2) * (y3 - y4)
  const d2 = (start1.y - end1.y) * (start2.x - end2.x); // (y1 - y2) * (x3 - x4)
  const d = d1 - d2;

  if (d == 0) {
    throw new Error('Number of intersection points is zero or infinity.');
  }

  // upper part of intersection point formula
  const u1 = start1.x * end1.y - start1.y * end1.x; // (x1 * y2 - y1 * x2)
  const u4 = start2.x * end2.y - start2.y * end2.x; // (x3 * y4 - y3 * x4)

  const u2x = start2.x - end2.x; // (x3 - x4)
  const u3x = start1.x - end1.x; // (x1 - x2)
  const u2y = start2.y - end2.y; // (y3 - y4)
  const u3y = start1.y - end1.y; // (y1 - y2)

  // intersection point formula
  const px = (u1 * u2x - u3x * u4) / d;
  const py = (u1 * u2y - u3y * u4) / d;

  return { x: px, y: py };
}

/*
 * Line intersection
 * See https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/ for details
 */

/**
 * Given three collinear points p, q, r, the function checks if point q lies on line segment 'pr'
 */
function onSegment(
  p: Coordinates2D,
  q: Coordinates2D,
  r: Coordinates2D
): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

/**
 * @private
 * Find orientation of ordered triplet (p, q, r)
 * @returns number One of the following values
 *  0 --> p, q and r are collinear
 *  1 --> Clockwise
 *  2 --> Counterclockwise
 */
function orientation(
  p: Coordinates2D,
  q: Coordinates2D,
  r: Coordinates2D
): 0 | 1 | 2 {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear

  return val > 0 ? 1 : 2; // clock or counter-clock wise
}

/**
 * Detects if two SEGMENTS ([start1, end1] and [start2, end2]) intersect
 */
export function doTwoSegmentsIntersect(
  start1: Coordinates2D,
  end1: Coordinates2D,
  start2: Coordinates2D,
  end2: Coordinates2D
): boolean {
  // Find the four orientations needed for general and
  // special cases
  const o1 = orientation(start1, end1, start2);
  const o2 = orientation(start1, end1, end2);
  const o3 = orientation(start2, end2, start1);
  const o4 = orientation(start2, end2, end1);

  // General case
  if (o1 != o2 && o3 != o4) return true;

  // Special Cases
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(start1, start2, end1)) return true;

  // p1, q1 and q2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(start1, end2, end1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(start2, start1, end2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  return o4 == 0 && onSegment(start2, end1, end2);
}
