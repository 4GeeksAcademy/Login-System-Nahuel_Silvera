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
				try {
					// Make a POST request to create a user
					const resp = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user)
					});
					if (!resp.ok) throw new Error("Failed to create user");
					const data = await resp.json();
					return true;
				} catch (error) {
					console.log("Error sending customer to backend", error);
					return false;
				}
			}
		}
	};
};

export default getState;
