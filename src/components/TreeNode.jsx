import { MdModeEditOutline } from "react-icons/md";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import './styles/TreeNode.css'

// Компонент для узла дерева
const TreeNode = ({ node, openNodes, onToggle, isOpen }) => {
  const { EditPanel } = useContext(AppContext)

  const openEditPanel = () => {
    EditPanel.setEditPanelNode(node)
  }

    return (
      <div className="tree-node">
        <div className="tree-node__header">

          <h3 className="tree-node__title" onClick={() => onToggle(node.name)} style={{color: node.color}}>
            {node.name} {node.children.length || node.additionalAttributes.length ? isOpen ? '[-]' : '[+]' : ''}
          </h3>
          
          <div className="tree-node__edit" onClick={openEditPanel}>
            <MdModeEditOutline title="Редактировать" />
          </div>

        </div>

        {isOpen && node.children && (
          <div className="tree-node__children">
            {node.children.map((childNode, index) => (
              <TreeNode key={index} node={childNode} openNodes={openNodes} onToggle={onToggle} isOpen={openNodes[childNode.name]}/>
            ))}
          </div>
        )}

        {isOpen && node.additionalAttributes && (
          <div>

            {node.additionalAttributes.map((attr, index) => (
              <p className="tree-node__additional-attribute" style={{color: node.color}} key={index}>{attr}</p>
            ))}

          </div>
        )}
      </div>
    )
}

export default TreeNode