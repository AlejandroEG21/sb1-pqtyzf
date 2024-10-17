import React from 'react';
import { Component, WebProperties } from '../types';

interface PreviewProps {
  components: Component[];
  selectedComponent: Component | null;
  setSelectedComponent: (component: Component) => void;
  updateComponent: (component: Component) => void;
  webProperties: WebProperties;
  updateWebProperties: (newProperties: Partial<WebProperties>) => void;
  isShapeSelected: boolean;
  setIsShapeSelected: (isSelected: boolean) => void;
}

const Preview: React.FC<PreviewProps> = ({
  components,
  selectedComponent,
  setSelectedComponent,
  updateComponent,
  webProperties,
  updateWebProperties,
  isShapeSelected,
  setIsShapeSelected,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: Component) => {
    e.dataTransfer.setData('text/plain', component.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentId = parseInt(e.dataTransfer.getData('text'), 10);
    const component = components.find((c) => c.id === componentId);
    if (component) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateComponent({
        ...component,
        position: { x, y },
      });
    }
  };

  const handleShapeDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', 'shape');
  };

  const handleShapeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateWebProperties({
      shapePosition: { x, y },
    });
  };

  const renderBackgroundShape = () => {
    const shapeStyle = {
      position: 'absolute' as 'absolute',
      left: `${webProperties.shapePosition.x}px`,
      top: `${webProperties.shapePosition.y}px`,
      backgroundColor: webProperties.shapeColor,
      opacity: 0.5,
      cursor: 'move',
    };

    const handleShapeClick = () => {
      setIsShapeSelected(true);
      setSelectedComponent(null);
    };

    switch (webProperties.backgroundShape) {
      case 'circle':
        return (
          <div
            style={{ ...shapeStyle, width: '300px', height: '300px', borderRadius: '50%' }}
            onClick={handleShapeClick}
            draggable
            onDragStart={handleShapeDragStart}
          />
        );
      case 'square':
        return (
          <div
            style={{ ...shapeStyle, width: '300px', height: '300px' }}
            onClick={handleShapeClick}
            draggable
            onDragStart={handleShapeDragStart}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              ...shapeStyle,
              width: 0,
              height: 0,
              borderLeft: '150px solid transparent',
              borderRight: '150px solid transparent',
              borderBottom: `300px solid ${webProperties.shapeColor}`,
              backgroundColor: 'transparent',
            }}
            onClick={handleShapeClick}
            draggable
            onDragStart={handleShapeDragStart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full h-full rounded-lg shadow-inner relative overflow-hidden"
      style={{ backgroundColor: webProperties.backgroundColor }}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        handleDrop(e);
        handleShapeDrop(e);
      }}
    >
      {renderBackgroundShape()}
      {components.map((component) => (
        <div
          key={component.id}
          style={{
            position: 'absolute',
            left: `${component.position.x}px`,
            top: `${component.position.y}px`,
            width: `${component.size.width}px`,
            height: `${component.size.height}px`,
            border: component === selectedComponent ? '2px solid blue' : '1px solid gray',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'move',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            color: webProperties.textColor,
          }}
          onClick={() => {
            setSelectedComponent(component);
            setIsShapeSelected(false);
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, component)}
        >
          {component.type === 'text' && <p className="text-sm">{component.content}</p>}
          {component.type === 'image' && (
            <img src={component.content} alt="Component" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
          )}
          {component.type === 'number' && <span className="text-sm font-medium">{component.content}</span>}
        </div>
      ))}
    </div>
  );
};

export default Preview;