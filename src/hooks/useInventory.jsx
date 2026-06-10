import { createContext, useContext, useReducer, useEffect } from "react";

const InventoryContext = createContext(null);

const STORAGE_KEY = "brickforge_inventory";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// inventory shape: { [brickId]: { quantity, label, imgUrl } }
function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { brickId, label, imgUrl, quantity = 1 } = action;
      const existing = state[brickId];
      return {
        ...state,
        [brickId]: {
          label: label ?? existing?.label ?? brickId,
          imgUrl: imgUrl ?? existing?.imgUrl ?? null,
          quantity: (existing?.quantity ?? 0) + quantity,
        },
      };
    }
    case "SET_QTY": {
      const { brickId, quantity } = action;
      if (quantity <= 0) {
        const next = { ...state };
        delete next[brickId];
        return next;
      }
      return {
        ...state,
        [brickId]: { ...state[brickId], quantity },
      };
    }
    case "REMOVE": {
      const next = { ...state };
      delete next[action.brickId];
      return next;
    }
    case "CLEAR":
      return {};
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [inventory, dispatch] = useReducer(reducer, {}, load);

  useEffect(() => { save(inventory); }, [inventory]);

  const addBrick = (brickId, label, imgUrl, quantity = 1) =>
    dispatch({ type: "ADD", brickId, label, imgUrl, quantity });

  const setQty = (brickId, quantity) =>
    dispatch({ type: "SET_QTY", brickId, quantity });

  const removeBrick = (brickId) =>
    dispatch({ type: "REMOVE", brickId });

  const clearInventory = () =>
    dispatch({ type: "CLEAR" });

  // For fitter engine: plain { [brickId]: quantity } map
  const flatInventory = Object.fromEntries(
    Object.entries(inventory).map(([id, v]) => [id, v.quantity])
  );

  const totalPieces = Object.values(inventory).reduce((s, v) => s + v.quantity, 0);

  return (
    <InventoryContext.Provider value={{
      inventory,
      flatInventory,
      totalPieces,
      addBrick,
      setQty,
      removeBrick,
      clearInventory,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}
