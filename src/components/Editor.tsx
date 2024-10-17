import React, { useState } from 'react';
import { Component, WebProperties } from '../types';

interface EditorProps {
  selectedComponent: Component | null;
  updateComponent: (component: Component) => void;
  webProperties: WebProperties;
  updateWebProperties: (newProperties: Partial<WebProperties>) => void;
  isShapeSelected: boolean;
}

const Editor: React.FC<EditorProps> = ({
  selectedComponent,
  updateComponent,
  webProperties,
  updateWebProperties,
  isShapeSelected,
}) => {
  const [activeTab, setActiveTab] = useState<'component' | 'general'>('component');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedComponent) {
      updateComponent({
        ...selectedComponent,
        [name]: name === 'content' ? value : parseInt(value, 10),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedComponent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateComponent({
          ...selectedComponent,
          content: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebPropertiesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateWebProperties({ [name]: value });
  };

  const handleShapePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateWebProperties({
      shapePosition: {
        ...webProperties.shapePosition,
        [name]: parseInt(value, 10),
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'component' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('component')}
        >
          Componente
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
      </div>

      {activeTab === 'component' && selectedComponent ? (
        <div className="space-y-4">
          {/* Existing component editor code */}
        </div>
      ) : activeTab === 'general' ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Color de fondo:</label>
            <input
              type="color"
              name="backgroundColor"
              value={webProperties.backgroundColor}
              onChange={handleWebPropertiesChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Color de texto:</label>
            <input
              type="color"
              name="textColor"
              value={webProperties.textColor}
              onChange={handleWebPropertiesChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Figura geométrica de fondo:</label>
            <select
              name="backgroundShape"
              value={webProperties.backgroundShape}
              onChange={handleWebPropertiesChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="none">Ninguna</option>
              <option value="circle">Círculo</option>
              <option value="square">Cuadrado</option>
              <option value="triangle">Triángulo</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Color de la figura:</label>
            <input
              type="color"
              name="shapeColor"
              value={webProperties.shapeColor}
              onChange={handleWebPropertiesChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          {isShapeSelected && (
            <>
              <div>
                <label className="block mb-1 font-medium">Posición X de la figura:</label>
                <input
                  type="number"
                  name="x"
                  value={webProperties.shapePosition.x}
                  onChange={handleShapePositionChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Posición Y de la figura:</label>
                <input
                  type="number"
                  name="y"
                  value={webProperties.shapePosition.y}
                  onChange={handleShapePositionChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-gray-500">Selecciona un componente para editar o cambia a la pestaña General</div>
      )}
    </div>
  );
};

export default Editor;