import { useEffect, useMemo, useState } from 'react';
import TreeNode from './TreeNode.jsx';

import './styles/Tree.css'

// Главный компонент дерева
const Tree = ({ nodes }) => {
    const [openNodes, setOpenNodes] = useState({})
    const [filter, setFilter] = useState({name: '', isOnlyExpandable: false})
    
    const filteredNodes = filterNodes(nodes, filter)
    
    const toggleNode = (nodeName) => {
        setOpenNodes((prev) => ({
            ...prev,
            [nodeName]: !prev[nodeName],
        }))
    }

    const toggleAll = () => {
        const newState = {}
        const traverse = (node) => {
            newState[node.name] = true

            if (node.children) {
                node.children.forEach(traverse)
            }
        }

        nodes.forEach(traverse);
        console.log(newState);
        setOpenNodes(newState);
    }

    console.log(filteredNodes, filter);
    return (
        <div className="tree">
            <input 
                className="tree__filter" 
                type="text"
                placeholder="Фильтр по имени" 
                value={filter.name}
                onChange={(e) => setFilter(
                    {
                        ...filter,
                        name: e.target.value
                    }
                )}
            />

            <div className="tree-checkbox">
                <input
                className="tree-checkbox__input"
                    type="checkbox"
                    id="isOnlyExpandable"
                    value="isOnlyExpandable"
                    onChange={(e) => setFilter(
                        {
                            ...filter,
                            isOnlyExpandable: e.target.checked
                        }
                    )}
                />
                <label className="tree-checkbox__label" htmlFor="isOnlyExpandable">Показывать только раскрываемые поддеревья</label>
            </div>

            <button className="tree__button-toggle-all" onClick={toggleAll}>Развернуть все</button>

            {filteredNodes && filteredNodes.map((node, index) => (
                <TreeNode
                    key={index}
                    node={node}
                    openNodes={openNodes}
                    onToggle={toggleNode}
                    isOpen={openNodes[node.name]}
                />
            ))}
        </div>
    )
}

// Функция для фильтрации узлов
const filterNodes = (nodes, filter) => {
    
    const filteredNodes = nodes.map(node => {
        const matches = node.name.toLowerCase().includes(filter.name.toLowerCase())
        const children = node.children.length > 0 ? filterNodes(node.children, filter).filter(child => child) : []
        let flag = true
      
        if (matches || children.length > 0) {
            if (filter.isOnlyExpandable && !children.length && !node.additionalAttributes.length) {
                flag = false
            }

            if (flag) return {
                    ...node,
                    children: children
                }
        }
    })
        
    return filteredNodes.filter(node => node);
}

export default Tree