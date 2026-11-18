import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ROWS = 9;
const COLS = 13;
const START = { r: 4, c: 1 };
const TARGET = { r: 4, c: 11 };

export type TerrainType = 'empty' | 'wall' | 'swamp' | 'mountain';
export type AlgoMode = 'astar' | 'dijkstra' | 'bfs' | 'greedy';

const TERRAIN_WEIGHTS: Record<TerrainType, number> = {
  empty: 1,
  swamp: 5,
  mountain: 10,
  wall: Infinity
};

const key = (r: number, c: number) => `${r},${c}`;

function createDefaultTerrain(): Map<string, TerrainType> {
  const m = new Map<string, TerrainType>();
  ['2,5', '3,5', '5,5', '6,5'].forEach((k) => m.set(k, 'wall'));
  ['4,5', '4,6', '3,6', '5,6'].forEach((k) => m.set(k, 'mountain'));
  ['1,5', '1,6', '7,5', '7,6'].forEach((k) => m.set(k, 'swamp'));
  ['2,9', '3,9', '4,8', '5,9', '6,9'].forEach((k) => m.set(k, 'wall'));
  ['4,9'].forEach((k) => m.set(k, 'swamp'));
  return m;
}

interface SolveResult {
  visitedOrder: string[];
  finalPath: string[];
  pathCost: number;
  found: boolean;
}

function solveGraph(terrain: Map<string, TerrainType>, mode: AlgoMode): SolveResult {
  const startKey = key(START.r, START.c);
  const targetKey = key(TARGET.r, TARGET.c);
  const heuristic = (r: number, c: number) => Math.abs(r - TARGET.r) + Math.abs(c - TARGET.c);

  const openSet: { r: number; c: number; g: number; f: number }[] = [
    {
      r: START.r,
      c: START.c,
      g: 0,
      f: mode === 'astar' || mode === 'greedy' ? heuristic(START.r, START.c) : 0
    }
  ];

  const cameFrom = new Map<string, { r: number; c: number }>();
  const gScore = new Map<string, number>([[startKey, 0]]);
  const closedSet = new Set<string>();
  const visitedOrder: string[] = [];

  let found = false;

  while (openSet.length > 0) {
    if (mode !== 'bfs') {
      openSet.sort((a, b) => a.f - b.f);
    }
    const current = openSet.shift()!;
    const currKey = key(current.r, current.c);

    if (closedSet.has(currKey)) continue;
    closedSet.add(currKey);

    if (currKey !== startKey && currKey !== targetKey) {
      visitedOrder.push(currKey);
    }

    if (currKey === targetKey) {
      found = true;
      break;
    }

    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    for (const [dr, dc] of dirs) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      const nKey = key(nr, nc);

      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      const tType = terrain.get(nKey) ?? 'empty';
      if (tType === 'wall' || closedSet.has(nKey)) continue;

      const stepCost = mode === 'bfs' ? 1 : TERRAIN_WEIGHTS[tType];
      const tentativeG = (gScore.get(currKey) ?? 0) + stepCost;
      const currentNeighborG = gScore.get(nKey) ?? Infinity;

      if (tentativeG < currentNeighborG) {
        cameFrom.set(nKey, { r: current.r, c: current.c });
        gScore.set(nKey, tentativeG);
        const h = heuristic(nr, nc);
        const fScore =
          mode === 'dijkstra' || mode === 'bfs'
            ? tentativeG
            : mode === 'greedy'
              ? h
              : tentativeG + h * 1.05;
        openSet.push({ r: nr, c: nc, g: tentativeG, f: fScore });
      }
    }
  }

  const finalPath: string[] = [];
  let truePathCost = 0;

  if (found) {
    let curr = TARGET;
    while (!(curr.r === START.r && curr.c === START.c)) {
      const pKey = key(curr.r, curr.c);
      const tType = terrain.get(pKey) ?? 'empty';
      truePathCost += TERRAIN_WEIGHTS[tType];
      const parent = cameFrom.get(pKey);
      if (!parent) break;
      if (!(parent.r === START.r && parent.c === START.c)) {
        finalPath.unshift(key(parent.r, parent.c));
      }
      curr = parent;
    }
  }

  return {
    visitedOrder,
    finalPath,
    pathCost: truePathCost,
    found
  };
}

export interface AlgoSandbox3DProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const AlgoSandbox3D: React.FC<AlgoSandbox3DProps> = React.memo(
  ({
    isFullscreen,
    onToggleFullscreen,
    isExpanded,
    onToggleExpand
  }) => {
    const [internalFullscreen, setInternalFullscreen] = useState(false);
    const isFullscreenActive = isFullscreen ?? isExpanded ?? internalFullscreen;

    const [algo, setAlgo] = useState<AlgoMode>('astar');
    const [brush, setBrush] = useState<TerrainType>('wall');
    const [terrain, setTerrain] = useState<Map<string, TerrainType>>(() => createDefaultTerrain());
    const [visitedSet, setVisitedSet] = useState<Set<string>>(() => new Set());
    const [pathSet, setPathSet] = useState<Set<string>>(() => new Set());
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [metrics, setMetrics] = useState<{
      scanned: number;
      cost: number;
      optimalCost: number;
      found: boolean;
    }>({ scanned: 0, cost: 0, optimalCost: 0, found: true });

    const isDrawingRef = useRef<boolean>(false);
    const eraseModeRef = useRef<boolean>(false);
    const timeoutsRef = useRef<number[]>([]);

    const clearTimers = useCallback(() => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    }, []);

    const handleToggleFullscreen = useCallback(async () => {
      const next = !isFullscreenActive;
      if (onToggleFullscreen) {
        onToggleFullscreen();
      } else if (onToggleExpand) {
        onToggleExpand();
      } else {
        setInternalFullscreen(next);
      }

      try {
        if (next) {
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            await document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.fullscreenElement) {
            await document.exitFullscreen().catch(() => {});
          }
        }
      } catch {
        // Fallback to CSS overlay
      }
    }, [isFullscreenActive, onToggleFullscreen, onToggleExpand]);

    // Native fullscreen change listener (e.g. user pressed ESC in browser native mode)
    useEffect(() => {
      const onFullscreenChange = () => {
        if (!document.fullscreenElement && isFullscreenActive) {
          if (onToggleFullscreen) {
            onToggleFullscreen();
          } else if (onToggleExpand) {
            onToggleExpand();
          } else {
            setInternalFullscreen(false);
          }
        }
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, [isFullscreenActive, onToggleFullscreen, onToggleExpand]);

    // Keyboard ESC listener
    useEffect(() => {
      if (!isFullscreenActive) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleToggleFullscreen();
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [isFullscreenActive, handleToggleFullscreen]);

    // Body scroll lock during fullscreen
    useEffect(() => {
      if (isFullscreenActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isFullscreenActive]);

    useEffect(() => {
      const onUp = () => {
        isDrawingRef.current = false;
      };
      window.addEventListener('mouseup', onUp);
      return () => window.removeEventListener('mouseup', onUp);
    }, []);

  const executeSimulation = useCallback(
    (activeTerrain: Map<string, TerrainType>, activeAlgo: AlgoMode, animate = true) => {
      clearTimers();

      const result = solveGraph(activeTerrain, activeAlgo);
      const dijkstraBaseline = solveGraph(activeTerrain, 'dijkstra');

      setMetrics({
        scanned: result.visitedOrder.length,
        cost: result.pathCost,
        optimalCost: dijkstraBaseline.pathCost,
        found: result.found
      });

      if (!animate) {
        setIsRunning(false);
        setVisitedSet(new Set(result.visitedOrder));
        setPathSet(new Set(result.finalPath));
        return;
      }

      setIsRunning(true);
      setVisitedSet(new Set());
      setPathSet(new Set());

      result.visitedOrder.forEach((nKey, idx) => {
        const tid = window.setTimeout(() => {
          setVisitedSet((prev) => new Set(prev).add(nKey));
        }, idx * 14);
        timeoutsRef.current.push(tid);
      });

      const pathStartDelay = result.visitedOrder.length * 14 + 40;
      if (result.found) {
        result.finalPath.forEach((nKey, idx) => {
          const tid = window.setTimeout(() => {
            setPathSet((prev) => new Set(prev).add(nKey));
          }, pathStartDelay + idx * 28);
          timeoutsRef.current.push(tid);
        });

        const doneTid = window.setTimeout(() => {
          setIsRunning(false);
        }, pathStartDelay + result.finalPath.length * 28 + 30);
        timeoutsRef.current.push(doneTid);
      } else {
        const doneTid = window.setTimeout(() => {
          setIsRunning(false);
        }, pathStartDelay + 30);
        timeoutsRef.current.push(doneTid);
      }
    },
    [clearTimers]
  );

  useEffect(() => {
    executeSimulation(terrain, algo, true);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyBrushAt = useCallback(
    (r: number, c: number, isInitialClick: boolean) => {
      if ((r === START.r && c === START.c) || (r === TARGET.r && c === TARGET.c)) return;
      const k = key(r, c);
      const next = new Map(terrain);
      const currentType = next.get(k) ?? 'empty';

      if (brush === 'empty') {
        next.delete(k);
      } else {
        if (isInitialClick) {
          eraseModeRef.current = currentType === brush;
        }
        if (eraseModeRef.current) {
          next.delete(k);
        } else {
          next.set(k, brush);
        }
      }

      setTerrain(next);
      executeSimulation(next, algo, false);
    },
    [terrain, brush, algo, executeSimulation]
  );

  const handleGenerateMaze = useCallback(() => {
    const next = new Map<string, TerrainType>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r === START.r && c === START.c) || (r === TARGET.r && c === TARGET.c)) continue;
        if (Math.abs(r - START.r) + Math.abs(c - START.c) === 1) continue;
        if (Math.abs(r - TARGET.r) + Math.abs(c - TARGET.c) === 1) continue;

        if (c % 2 === 1 && r % 2 === 0 && Math.random() < 0.65) {
          next.set(key(r, c), 'wall');
        } else if (Math.random() < 0.22) {
          next.set(key(r, c), 'wall');
        }
      }
    }
    setTerrain(next);
    executeSimulation(next, algo, true);
  }, [algo, executeSimulation]);

  const handleGenerateWeightedTerrain = useCallback(() => {
    const next = new Map<string, TerrainType>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r === START.r && c === START.c) || (r === TARGET.r && c === TARGET.c)) continue;
        const roll = Math.random();
        if (roll < 0.16) {
          next.set(key(r, c), 'wall');
        } else if (roll < 0.34) {
          next.set(key(r, c), 'mountain');
        } else if (roll < 0.5) {
          next.set(key(r, c), 'swamp');
        }
      }
    }
    setTerrain(next);
    executeSimulation(next, algo, true);
  }, [algo, executeSimulation]);

  const handleClear = useCallback(() => {
    const empty = new Map<string, TerrainType>();
    setTerrain(empty);
    executeSimulation(empty, algo, true);
  }, [algo, executeSimulation]);

  const handleAlgoChange = useCallback(
    (nextAlgo: AlgoMode) => {
      setAlgo(nextAlgo);
      executeSimulation(terrain, nextAlgo, true);
    },
    [terrain, executeSimulation]
  );

  const isOptimal = useMemo(
    () => metrics.found && metrics.cost === metrics.optimalCost,
    [metrics]
  );

  const content = (
    <div className={`caldera-sandbox iso-workbench ${isFullscreenActive ? 'is-fullscreen' : ''}`}>
      {/* Top Header: Title, Fullscreen Toggle, Description & Live Telemetry */}
      <div className="iso-header-bar">
        <div className="iso-title-row">
          <div className="iso-title-group">
            <h3 className="iso-title">
              3D Pathfinding Sandbox
              {isFullscreenActive && <span className="iso-fs-badge">Fullscreen Lab</span>}
            </h3>
            <p className="iso-instructions">
              Interactive preview of my 3D AlgoVisualizer. Click or drag to draw walls and terrain, then compare how{' '}
              <strong>A*</strong> routes around high-cost Mountains (cost 10) and Swamps (cost 5) while <strong>BFS</strong> ignores terrain costs completely.
            </p>
          </div>
          <button
            type="button"
            className={`iso-expand-btn btn btn-sm ${isFullscreenActive ? 'btn-primary' : 'btn-surface'}`}
            onClick={handleToggleFullscreen}
            title={isFullscreenActive ? 'Exit full screen (ESC)' : 'Enter true full screen laboratory mode (ESC to exit)'}
            aria-label={isFullscreenActive ? 'Exit full screen mode' : 'Open true full screen laboratory mode'}
          >
            {isFullscreenActive ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Exit Fullscreen (ESC)</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                <span>Fullscreen ⛶</span>
              </>
            )}
          </button>
        </div>

        <div className="iso-telemetry-bar">
          <div className="iso-telemetry">
            <span className="iso-stat-box">
              Tiles checked: <strong>{metrics.scanned}</strong>
            </span>
            <span className="iso-stat-box">
              Route cost: <strong>{metrics.found ? metrics.cost : 'Blocked'}</strong>
            </span>
          </div>
          <span
            className={`iso-optimality-badge ${
              !metrics.found ? 'blocked' : isOptimal ? 'optimal' : 'suboptimal'
            }`}
          >
            <span className="status-dot" />
            {!metrics.found
              ? 'No path possible'
              : isOptimal
                ? 'Cheapest path found'
                : `Suboptimal route (+${metrics.cost - metrics.optimalCost} extra cost)`}
          </span>
        </div>
      </div>

      {/* Center: Full-Width 3D Isometric Board Stage */}
      <div className="iso-stage-wrapper">
        <div className="iso-stage-frame">
          <div className="iso-perspective-wrap">
            <div className="iso-grid">
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((__, c) => {
                  const k = key(r, c);
                  const tType = terrain.get(k) ?? 'empty';
                  const isStart = r === START.r && c === START.c;
                  const isTarget = r === TARGET.r && c === TARGET.c;
                  const isPath = pathSet.has(k);
                  const isVisited = visitedSet.has(k);

                  const classes = [
                    'iso-tile',
                    `terrain-${tType}`,
                    isStart ? 'tile-start' : '',
                    isTarget ? 'tile-target' : '',
                    isPath ? 'tile-path' : isVisited ? 'tile-visited' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={k}
                      type="button"
                      className={classes}
                      onMouseDown={() => {
                        isDrawingRef.current = true;
                        applyBrushAt(r, c, true);
                      }}
                      onMouseEnter={() => {
                        if (isDrawingRef.current) {
                          applyBrushAt(r, c, false);
                        }
                      }}
                      aria-label={`Row ${r + 1} Col ${c + 1} (${tType})`}
                    >
                      <span className="iso-tile-top">
                        {isStart
                          ? 'S'
                          : isTarget
                            ? 'G'
                            : tType === 'mountain'
                              ? '10'
                              : tType === 'swamp'
                                ? '5'
                                : ''}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="sim-legend">
          <span><span className="legend-dot start" /> Start (S)</span>
          <span><span className="legend-dot target" /> Goal (G)</span>
          <span><span className="legend-dot wall" /> Wall (blocked)</span>
          <span><span className="legend-dot mountain" /> Mountain (cost 10)</span>
          <span><span className="legend-dot swamp" /> Swamp (cost 5)</span>
          <span><span className="legend-dot path" /> Chosen route</span>
        </div>
      </div>

      {/* Bottom Controls Dock: Algorithm, Brush, Actions */}
      <div className="iso-controls-dock">
        <div className="iso-control-block">
          <span className="iso-group-label">1. Algorithm</span>
          <div className="iso-btn-grid" role="group" aria-label="Select pathfinding algorithm">
            {(
              [
                {
                  id: 'astar',
                  label: 'A* (weighted)',
                  desc: 'Finds the cheapest path by combining straight-line distance to the goal with terrain cost.'
                },
                {
                  id: 'dijkstra',
                  label: 'Dijkstra',
                  desc: 'Checks tiles outward in order of terrain cost; always finds the cheapest possible path.'
                },
                {
                  id: 'bfs',
                  label: 'BFS (unweighted)',
                  desc: 'Finds the path with the fewest steps, completely ignoring Mountain and Swamp penalties.'
                },
                {
                  id: 'greedy',
                  label: 'Greedy',
                  desc: 'Heads straight toward the goal based only on distance—fast, but easily tricked by obstacles.'
                }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`iso-grid-btn ${algo === item.id ? 'active' : ''}`}
                onClick={() => handleAlgoChange(item.id)}
                title={item.desc}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="iso-control-block">
          <span className="iso-group-label">2. Click/drag terrain brush</span>
          <div className="iso-btn-grid" role="group" aria-label="Terrain brush">
            {(
              [
                { id: 'wall', label: 'Wall (blocked)', desc: 'Blocks movement completely.' },
                { id: 'mountain', label: 'Mountain (10)', desc: 'Slow terrain with a movement cost of 10.' },
                { id: 'swamp', label: 'Swamp (5)', desc: 'Slow terrain with a movement cost of 5.' },
                { id: 'empty', label: 'Erase tile', desc: 'Resets a tile back to normal ground (cost 1).' }
              ] as const
            ).map((b) => (
              <button
                key={b.id}
                type="button"
                className={`iso-brush-btn brush-${b.id} ${brush === b.id ? 'active' : ''}`}
                onClick={() => setBrush(b.id)}
                title={b.desc}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="iso-control-block">
          <span className="iso-group-label">3. Board actions</span>
          <div className="iso-btn-grid">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => executeSimulation(terrain, algo, true)}
            >
              {isRunning ? 'Solving...' : 'Replay search'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-surface"
              onClick={handleGenerateWeightedTerrain}
              title="Generates random mountain ranges and swamps"
            >
              Random terrain
            </button>
            <button
              type="button"
              className="btn btn-sm btn-surface"
              onClick={handleGenerateMaze}
              title="Generates a recursive-division maze"
            >
              Wall maze
            </button>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={handleClear}
            >
              Clear board
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreenActive && typeof document !== 'undefined') {
    return (
      <>
        <div className="iso-placeholder-card" aria-hidden="true">
          <span>Active in Fullscreen Laboratory Mode (ESC to return)</span>
        </div>
        {createPortal(content, document.body)}
      </>
    );
  }

  return content;
});

AlgoSandbox3D.displayName = 'AlgoSandbox3D';
export default AlgoSandbox3D;
