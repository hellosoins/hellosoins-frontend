import React from "react";
import { Button } from "@/components/ui/Button";
import { Images, Save } from "lucide-react";

const CabinetForm = ({ formData, setFormData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === "pmr" && type === "radio") {
      const pmrValue = value === "true";
      setFormData(prev => ({ ...prev, pmr: pmrValue }));
    } else if (type === "file") {
      setFormData(prev => ({ ...prev, photos: Array.from(files) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2 flex flex-col items-start justify-center">
      <div className="w-full sm:w-1/2">
        <p className="text-sm font-bold text-gray-900 mb-2">Où recevez vous vos patients ?</p>
      </div>

      {/* Nom du cabinet */}
      <div className="w-full flex flex-col justify-center items-start">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Nom du cabinet
        </label>
        <input
          type="text"
          name="cabinetName"
          value={formData.cabinetName}
          onChange={handleChange}
          placeholder="Entrer le nom de votre cabinet"
          className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
        />
      </div>

      {/* Adresse complète */}
      <div className="w-full flex flex-col justify-center items-start">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Adresse complète <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Entrer votre adresse complète"
          required
          className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
        />
      </div>

      {/* Complément d'adresse */}
      <div className="w-full flex flex-col justify-center items-start">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Complément d'adresse
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          placeholder="Entrer le nom de votre complément d'adresse"
          className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
        />
      </div>

      {/* Téléphone du cabinet */}
      <div className="w-full flex flex-col justify-center items-start">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Téléphone du cabinet
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Entrer votre téléphone"
          className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
        />
      </div>

      {/* Accès PMR */}
      <div className="w-full sm:w-1/2 py-2">
        <p className="block text-xs text-gray-700">Accès PMR</p>
        <div className="mt-1 flex items-center gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="pmr"
              value="true"
              checked={formData.pmr === true}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700 text-xs">Oui</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="pmr"
              value="false"
              checked={formData.pmr === false}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700 text-xs">Non</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="w-full flex flex-col justify-center items-start">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Entrer la description du cabinet"
          rows={4}
          className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
        />
      </div>

      {/* Upload photos */}
      <div className="w-full sm:w-1/2">
        <label className="block text-xs text-gray-700 w-full sm:w-1/2 text-start">
          Téléchargez une ou plusieurs photos du cabinet
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-green-700 rounded-md cursor-pointer">
          <div className="space-y-1 text-center">
            <Images className="mx-auto text-green-400" />
            <div className="flex text-xs text-green-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white font-medium text-primary-600 hover:text-primary-500"
              >
                <span>Cliquer pour remplacer ou glisser-déposer</span>
                <input
                  id="file-upload"
                  name="photos"
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.gif"
                  multiple
                  onChange={handleChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs text-green-500">
              SVG, PNG, JPG ou GIF (max. 400 × 400px)
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full sm:w-1/2">
        <div className="flex space-x-2">
          <Button type="submit" className="text-white text-xs rounded">
            <Save className="mr-1" />
            Enregistrer
          </Button>
          <Button variant="outline" onClick={onCancel} className="text-xs rounded">
            Annuler
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CabinetForm;