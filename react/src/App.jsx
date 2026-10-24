import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API, IMAGE_API } from './API.js';
import Modal from './Modal.jsx';

const App = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [search, setSearch] = useState('');

  async function getUsers(searchValue = '') {
    try {
      const response = await axios.get(API, {
        params: { query: searchValue },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteUser(id) {
    try {
      await axios.delete(`${API}?id=${id}`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  async function addUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('Images');

    formData.set('Name', formData.get('Name')?.trim() || '');
    formData.set('Description', formData.get('Description')?.trim() || '');
    formData.set('Images', file);
    formData.set('isCompleted', formData.get('Status'));

    try {
      await axios.post(API, formData);
      setOpen(false);
      setImagePreview('');
      getUsers();
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  }

  function EditData(user) {
    setEditData(user);
    setEditOpen(true);
    setImagePreview(
      user.images?.[0]?.imageName ? `${IMAGE_API}/${user.images[0].imageName}` : '',
    );
  }

  function ViewData(user) {
    setViewData(user);
    setViewOpen(true);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      setImagePreview('');
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  async function editUser(e) {
    e.preventDefault();

    if (!editData?.id) {
      console.warn('No user selected for edit.');
      return;
    }

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get('Name'),
      description: formData.get('Description'),
      id: editData.id,
      isCompleted: formData.get('Status') === 'true',
    };

    try {
      await axios.put(API, payload);
      setEditOpen(false);
      setImagePreview('');
      e.target.reset();
      getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getUsers(search);
    }, 500);


   return () => clearTimeout(timeout);
  }, [search]);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();
    return user.name?.toLowerCase().includes(searchText);
  });

  return (
    <div className=" bg-gray-50 p-6 text-gray-800">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Пользователи</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md "
            onClick={() => setOpen(true)}
          >
            + Добавить пользователя
          </button>
        </div>

        <div className="mb-6">
          <input
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            type="text"
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-md text-gray-500 text-sm">
            Пользователи не найдены
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredUsers.map((el) => (
              <div key={el.id} className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
                <div>
                  <img
                    className="w-20 h-20 mx-auto rounded-full object-cover mb-3 border border-gray-100"
                    src={
                      el.images?.[0]?.imageName
                        ? `${IMAGE_API}/${el.images[0].imageName}`
                        : 'https://placehold.co/80'
                    }
                    alt={el.name}
                  />
                  <h3 className="text-sm font-medium text-gray-900 text-center mb-1">{el.name}</h3>
                  <p className="text-xs text-gray-500 text-center mb-4 line-clamp-2">
                    {el.description || 'Нет описания'}
                  </p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100 text-xs">
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded transition"
                    onClick={() => ViewData(el)}
                  >
                    Инфо
                  </button>
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded transition"
                    onClick={() => EditData(el)}
                  >
                    Ред.
                  </button>
                  <button
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded transition"
                    onClick={() => deleteUser(el.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          header={'Новый пользователь'}
          open={open}
          onClose={() => {
            setOpen(false);
            setImagePreview('');
          }}
          onSave={addUser}
        >


<div className="flex flex-col gap-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Имя</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-1.5 "
                type="text"
                name="Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-1.5 "
                rows="2"
                name="Description"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Фотография</label>
              <input
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                type="file"
                name="Images"
                onChange={handleImageChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Статус</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-1.5"
                name="Status"
                defaultValue="false"
              >
                <option value="false">Активен</option>
                <option value="true">Неактивен</option>
              </select>
            </div>

            {imagePreview && (
              <img
                className="w-20 h-20 rounded border border-gray-200 mt-1"
                src={imagePreview}
              />
            )}
          </div>
        </Modal>

        <Modal
          header={'Редактирование'}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setImagePreview('');
          }}
          onSave={editUser}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Имя</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-1.5"
                type="text"
                name="Name"
                defaultValue={editData?.name}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-1.5 "
                rows="2"
                name="Description"
                defaultValue={editData?.description}
                required
              />
            </div>


 <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Статус</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white"
                name="Status"
                defaultValue={editData?.isCompleted ? 'true' : 'false'}
              >
                <option value="false">Активен</option>
                <option value="true">Неактивен</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Заменить фото</label>
              <input
                className="w-full text-xs text-gray-500 "
                type="file"
                name="Images"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {imagePreview && (
              <img
                className="w-20 h-20 rounded border border-gray-200 mt-1"
                src={imagePreview}
                alt="Предпросмотр"
              />
            )}
          </div>
        </Modal>

        <Modal
          header={'Информация'}
          open={viewOpen}
          onClose={() => {
            setViewOpen(false);
            setViewData(null);
          }}
          onSave={(e) => {
            e.preventDefault();
            setViewOpen(false);
            setViewData(null);
          }}
        >
          {viewData && (
            <div className="flex flex-col items-center text-center text-sm">
              <img
                className="w-24 h-24 rounded-full object-cover mb-3 border border-gray-200"
                src={
                  viewData.images?.[0]?.imageName
                    ? `${IMAGE_API}/${viewData.images[0].imageName}`
                    : 'https://placehold.co/96'
                }
                alt={viewData.name}
              />
              <h3 className="text-lg font-medium text-gray-900">{viewData.name}</h3>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full my-2 ${
                  viewData.isCompleted
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-green-50 text-green-600 border border-green-200'
                }`}
              >
                {viewData.isCompleted ? 'Неактивен' : 'Активен'}
              </span>
              <p className="text-gray-600 text-xs mt-1">{viewData.description}</p>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default App;
