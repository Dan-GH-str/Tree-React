import { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { IoAddCircleOutline } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosReturnLeft } from "react-icons/io";
import Modal from 'react-modal';

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import "./styles/EditPanel.css"

const EditPanel = () => {
    const [ itemsToCreate, setItemsToCreate ] = useState({ attrs: [], children: [] }) // для хранения индексов создаваемых детей и атрибутов узла
    const [ itemsToDelete, setItemsToDelete ] = useState({ attrs: [], children: [] }) // для хранения индексов удаляемых детей и атрибутов узла  
    const [modalIsOpen, setIsOpen] = useState(false);
    const { JSONData, EditPanel: { editPanelNode: node, setEditPanelNode } } = useContext(AppContext)
    const [ color, setColor ] = useColor(node.color)

    let newNodeName = node.name

    // ----- Методы для создания атрибутов и подузлов

    const handleAttrsAdd = () => {
        node.additionalAttributes.push("Новый атрибут")
        
        setItemsToCreate((prev) => ({ ...prev, attrs: [...prev.attrs, node.additionalAttributes.length - 1] }))
    }

    const handleChildrenAdd = () => {
        node.children.push({ name: "Новый узел", additionalAttributes: [], color: "#212529", children: [] })
        
        setItemsToCreate((prev) => ({ ...prev, children: [...prev.children, node.children.length - 1] }))
    }

    // ----- Методы для удаления атрибутов и подузлов

    const handleAttrsDelete = useCallback((index) => {
        setItemsToDelete((prev) => ({ ...prev, attrs: [...prev.attrs, index] }))
    }, [])

    const handleAttrsRestore = useCallback((index) => {
        setItemsToDelete((prev) => ({ ...prev, attrs: prev.attrs.filter((i) => i !== index) }))
    }, [])

    const attrsDelete = (attrs) => {
        attrs.sort((a, b) => b - a).forEach(index => node.additionalAttributes.splice(index, 1))
    }

    const handleChildrenDelete = useCallback((index) => {
        setItemsToDelete((prev) => ({ ...prev, children: [...prev.children, index] }))
    }, [])

    const handleChildrenRestore = useCallback((index) => {
        setItemsToDelete((prev) => ({ ...prev, children: prev.children.filter((i) => i !== index) }))
    }, [])

    const childrenDelete = () => {
        itemsToDelete.children.sort((a, b) => b - a).forEach(index => node.children.splice(index, 1))
    }

    // ----- Методы для сохрания/отмены изменений

    const handleUpdate = () => {
        itemsToDelete.attrs.length && attrsDelete(itemsToDelete.attrs) // удаление отмеченных пользователем атрибутов
        itemsToDelete.children.length && childrenDelete() // удаление отмеченных пользователем подузлов

        const findAndUpdateNode = (currentNode) => {
            if (currentNode.name === node.name) {
                currentNode.name = newNodeName
                currentNode.color = color.hex
                currentNode.additionalAttributes = node.additionalAttributes
                currentNode.children = node.children
            } else if (currentNode.children) {
                currentNode.children.forEach(findAndUpdateNode)
            }
        }
        
        JSONData.forEach(findAndUpdateNode)
        
        setEditPanelNode({})
    }

    const handleClose = () => {
        itemsToCreate.attrs.length && attrsDelete(itemsToCreate.attrs)

        setEditPanelNode({})
    }

    return (
        <>
            <div className="mask" onClick={handleClose}></div>

            <div className="edit-panel">
                <h3 className="edit-panel__title">Панель редактирования узла</h3>

                <div className="edit-panel__node-name">
                    <h4 className="edit-panel__node-name-title">Название узла: </h4>
                    <input className="edit-panel__input" type="text" defaultValue={node.name} onChange={(e) => newNodeName = e.target.value}/>
                </div>

                <div className="edit-panel__block">
                    <h4>Дополнительные атрибуты:</h4>
                    <ul className="edit-panel__list">
                        {node.additionalAttributes.map((attribute, index) => (
                            <li className="edit-panel__list-item" key={index}>

                                <div className="edit-panel__list-item-inner">
                                    <span>Название атрибута: </span>
                                    <input 
                                        className="edit-panel__input" 
                                        type="text" 
                                        defaultValue={attribute} 
                                        onChange={(e) => node.additionalAttributes[e.target.dataset.index] = e.target.value}
                                        data-index={index}
                                    />

                                    {itemsToDelete.attrs.includes(index) 
                                        ? 
                                        <>
                                            <button 
                                                className="btn btn-light edit-panel__cancel-btn"
                                                type="button" 
                                                title="Отменить удаление"
                                                onClick={() => handleAttrsRestore(index)}
                                            >
                                                <IoIosReturnLeft className="edit-panel__dlt-icon"/>
                                            </button>
                                            <span className="edit-panel__dlt-msg">Атрибут будет удален</span>
                                        </>
                                        :
                                        <button 
                                            className="btn btn-danger edit-panel__dlt-btn"
                                            type="button" 
                                            onClick={() => handleAttrsDelete(index)}
                                            title="Удалить элемент"
                                        >
                                            <TiDeleteOutline className="edit-panel__dlt-icon"/>
                                        </button>
                                    }

                                </div>
                            </li>
                        ))}
                    </ul>
                    <button 
                        type="button" 
                        className="btn btn-primary edit-panel__add-btn"
                        title="Добавить элемент"
                        onClick={handleAttrsAdd}
                    >
                        <IoAddCircleOutline className="edit-panel__add-icon"/>
                    </button>
                </div>

                <div className="edit-panel__block">
                    <h4>Дочерние узлы:</h4>
                    <ul className="edit-panel__list">
                        {node.children.map((child, index) => (
                            <li className="edit-panel__list-item" key={index}>
                                
                                <div className="edit-panel__list-item-inner">
                                    <span>Название подузла: </span>
                                    <input 
                                        className="edit-panel__input" 
                                        type="text" 
                                        defaultValue={child.name} 
                                        onChange={(e) => node.children[e.target.dataset.index].name = e.target.value}
                                        data-index={index}
                                    />

                                    {itemsToDelete.children.includes(index) 
                                        ? 
                                        <>
                                            <button 
                                                className="btn btn-light edit-panel__cancel-btn"
                                                type="button" 
                                                title="Отменить удаление"
                                                onClick={() => handleChildrenRestore(index)}
                                            >
                                                <IoIosReturnLeft className="edit-panel__dlt-icon"/>
                                            </button>
                                            <span className="edit-panel__dlt-msg">Атрибут будет удален</span>
                                        </>
                                        :
                                        <button 
                                            className="btn btn-danger edit-panel__dlt-btn"
                                            type="button" 
                                            onClick={() => handleChildrenDelete(index)}
                                            title="Удалить элемент"
                                        >
                                            <TiDeleteOutline className="edit-panel__dlt-icon"/>
                                        </button>
                                    }
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button 
                        className="btn btn-primary edit-panel__add-btn"
                        type="button" 
                        onClick={handleChildrenAdd}
                    >
                        <IoAddCircleOutline className="edit-panel__add-icon"/>
                    </button>
                </div>
                
                <hr className="delimiter"></hr>

                <div className="edit-panel__block">
                    <h4>Цвет узла: </h4>

                    <div className="color-picker__layout">
                     <ColorPicker hideInput={["rgb", "hsv"]} color={color} onChange={setColor} />
                    </div>
                </div>

                <div className="edit-panel__btn-group">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Отменить</button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate}>Сохранить</button>
                </div>
            </div>
        </>
    )
}

export default EditPanel