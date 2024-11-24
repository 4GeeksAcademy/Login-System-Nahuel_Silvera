
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: localStorage.getItem("token") || null // Agregamos el token al store
		},
		actions: {

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},

			createUser: async (user) => {

				console.log("[DEBUG] Datos enviados: " + JSON.stringify(user));
				try {
					const resp = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user)
					});
					if (!resp.ok) throw new Error("Error al crear el usuario.");
					const data = await resp.json();
					return true;
				} catch (error) {
					console.log("Error al enviar la información al backend", error);
					return false;
				}
			},

			login: async(email, password) => {
				
				try{

					const resp = await fetch(process.env.BACKEND_URL + "api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password }),
					});

					if (!resp.ok) throw new Error("Error al iniciar sesión.");

					const data = await resp.json();

					if (data.token) {
						localStorage.setItem("idToken", data.token);
						return true;
					}

					return false; // Si el mail/pass son correctos pero no se genera token
				}catch (error){
					console.log("Los datos de sesión no son correctos", error);
					return false;
				}

			}
		}
	};
};

export default getState;
