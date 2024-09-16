const urlBase = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];

const getData = () => {
	const postList = document.getElementById('postList');
	const buttonList = document.querySelector('.button-standard');
	if (postList.style.display === 'none' || postList.style.display === '') {
		if (posts.length === 0) {
			fetch(urlBase)
				.then(res => res.json())
				.then(data => {
					posts = data
					showPostList(posts);
					postList.style.display = "block";
					buttonList.textContent = "Ocultar posts";
				}).catch(error => console.error('Error al llamar a la API: ', error));
		} else {
			showPostList(posts);
			postList.style.display = "block";
			buttonList.textContent = "Ocultar posts";
		}
	} else {
		postList.style.display = "none";
		buttonList.textContent = "Ver posts";
	}
}


const showPostList = (posts) => {
	const postList = document.getElementById('postList');
	postList.textContent = '';

	posts.forEach((post) => {
		// Mostrar solo posteos del usuario con id 1
		if (post.userId === 1) {
			// Crear li para almacenar el post
			const listItem = document.createElement('li');
			listItem.classList.add('postItem');
			postList.appendChild(listItem);

			// Mostrar el title del post con h4 desde la API
			const titleItem = document.createElement('h4');
			titleItem.classList.add('postTitle');
			titleItem.textContent = post.title;
			listItem.appendChild(titleItem);

			// 	Mostrar el body del post con parrafo desde la API
			const bodyItem = document.createElement('p');
			bodyItem.classList.add('postBody');
			bodyItem.textContent = post.body;
			listItem.appendChild(bodyItem);

			// 	Mostrar boton para modificar post en la API
			const editPostButtonItem = document.createElement('button');
			editPostButtonItem.id = `editButtonId-${post.id}`;
			editPostButtonItem.setAttribute('onclick', `editPost(${post.id})`);
			editPostButtonItem.textContent = 'Editar'
			listItem.appendChild(editPostButtonItem);

			// 	Mostrar boton para eliminar post en la API
			const deletePostButtonItem = document.createElement('button');
			deletePostButtonItem.id = `deleteButtonId-${post.id}`;
			deletePostButtonItem.setAttribute('onclick', `deletePost(${post.id})`);
			deletePostButtonItem.textContent = 'Borrar';
			listItem.appendChild(deletePostButtonItem);

			// 	Div para modificar post en la API
			const editPostItem = document.createElement('div');
			editPostItem.id = `editPost-${post.id}`
			editPostItem.style.display = 'none';
			listItem.appendChild(editPostItem);

			// 	label modificacion titulo post
			const editLabelTitleItem = document.createElement('label');
			editLabelTitleItem.textContent = 'Título';
			editPostItem.appendChild(editLabelTitleItem);

			// input modificacion titulo post
			const editInputTitleItem = document.createElement('input');
			editInputTitleItem.id = `editInputTitle-${post.id}`;
			editInputTitleItem.setAttribute('type', 'text');
			editInputTitleItem.setAttribute('required', '');
			editInputTitleItem.setAttribute('value', `${post.title}`);
			editPostItem.appendChild(editInputTitleItem);

			// 	label modificacion body post
			const editLabelBodyItem = document.createElement('label');
			editLabelBodyItem.textContent = 'Comentario';
			editPostItem.appendChild(editLabelBodyItem);

			// input modificacion body post
			const editInputBodyItem = document.createElement('input');
			editInputBodyItem.id = `editInputBody-${post.id}`;
			editInputBodyItem.setAttribute('type', 'textarea');
			editInputBodyItem.setAttribute('required', '');
			editInputBodyItem.setAttribute('value', `${post.body}`)
			editPostItem.appendChild(editInputBodyItem);

			// buton confirmacion update
			const buttonUpdateItem = document.createElement('button');
			buttonUpdateItem.id = `buttonUpdate-${post.id}`;
			buttonUpdateItem.setAttribute('onclick', `updatePost(${post.id})`);
			buttonUpdateItem.textContent = 'Actualizar';
			editPostItem.appendChild(buttonUpdateItem);

		}
	})
}

const postData = (event) => {
	const postTitle = document.getElementById('postTitle').value;
	const postBody = document.getElementById('postBody').value;
	const postForm = document.getElementById('postForm');
	event.preventDefault();
	if (postTitle.trim() === '' || postBody.trim() === '') {
		alert('Los campos son obligatorios. favor completar');
		return;
	}
	fetch(urlBase, {
		method: 'POST',
		body: JSON.stringify({
			title: postTitle,
			body: postBody,
			userId: 1,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}).then(res => res.json())
		.then(data => {
			posts.push(data);
			showPostList(posts);
			postForm.reset();

		}).catch(error => console.log('Error al querer realizar el post', error))
}


const editPost = (id) => {
	const editPostItem = document.getElementById(`editPost-${id}`)
	editPostItem.style.display = (editPostItem.style.display === 'none' ? 'block' : 'none');
}

const updatePost = (id) => {
	const updateInputTitle = document.getElementById(`editInputTitle-${id}`);
	const updateInputBody = document.getElementById(`editInputBody-${id}`);
	if (id >= 0 && id <= 9) {

		fetch(`${urlBase}/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				id: id,
				title: updateInputTitle.value,
				body: updateInputBody.value,
				userId: 1,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
			.then(res => res.json())
			.then(data => {
				const postIndex = posts.findIndex(post => post.id === data.id);
				posts[postIndex].title = data.title;
				posts[postIndex].body = data.body;
				getData();
			})
	} else {
		const postIndex = posts.findIndex(post => post.id === id);
		posts[postIndex].title = updateInputTitle.value;
		posts[postIndex].body = updateInputBody.value;
		getData();
	}
}

const deletePost = (id) => {
	if (id >= 0 && id <= 9) {
		fetch(`${urlBase}/${id}`, {
			method: 'DELETE',
		})
			.then(res => {
				if (res.ok) {
					const postIndex = posts.findIndex(post => post.id === id);
					posts.splice(postIndex, 1);
					showPostList(posts);
				} else {
					alert("Hubo un problema y no se pudo eliminar el post")
				}
			}).catch(error => {
			console.error('Hubo un error', error);
		})
	} else {
		const postIndex = posts.findIndex(post => post.id === id);
		posts.splice(postIndex, 1);
		showPostList(posts);
	}
}

