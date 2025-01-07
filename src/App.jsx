import Tree from "./components/Tree";
import { AppContext } from "./context/AppContext";
import { useState } from "react";
import EditPanel from "./components/EditPanel";

import './App.css'

const jsonData = [
  {
    name: 'Узел 1',
    additionalAttributes: ['Доп. атрибут 1', 'Доп. атрибут 2'],
    color: "#212529",
    children: [
      {
        name: 'Подузел 1.1',
        additionalAttributes: ['Доп. атрибут 1.1'],
        color: "#212529",
        children: [
          {
            name: 'Подузел 1.1.1',
            additionalAttributes: ['Доп. атрибут 1.1.1'],
            color: "#212529",
            children: [
              {
                name: 'Подузел 1.1.1.1 (Нераскрываемый)',
                color: "#212529",
                additionalAttributes: [],
                children: []
              }
            ]
          },
        ]
      },
      {
        name: 'Подузел 1.2',
        additionalAttributes: ['Доп. атрибут 1.2'],
        color: "#212529",
        children: []
      },
      {
        name: 'Подузел 1.3',
        additionalAttributes: ['Доп. атрибут 1.3'],
        color: "#212529",
        children: []
      }
    ]
  }
]

const App = () => {
  const [editPanelNode, setEditPanelNode] = useState({});

  return (
    <AppContext.Provider value={{ JSONData: jsonData, EditPanel: { editPanelNode, setEditPanelNode } }}>
      <main className="App">
        <h1>Дерево</h1>
        <Tree nodes={jsonData} />

        {Object.keys(editPanelNode).length > 0 && <EditPanel />}
      </main>
    </AppContext.Provider>
  )
}

export default App;
