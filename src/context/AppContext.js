import { createContext } from "react";

export const AppContext = createContext({ JSONData: [], EditPanel: { editPanelNode: {}, setEditPanelNode: () => {} } });