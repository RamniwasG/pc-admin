// --- Mock backend setup (uses localStorage) ---
const MOCK_LS_KEY = "admin_dashboard_mock";

function loadMockData() {
  try {
    const raw = localStorage.getItem(MOCK_LS_KEY);
    if (!raw) {
      // seed data
      const seed = {
        categories: [
          { id: "cat1", name: "Clothing" },
          { id: "cat2", name: "Electronics" },
        ],
        subcategories: [
          { id: "sub1", name: "T-Shirts", categoryId: "cat1" },
          { id: "sub2", name: "Laptops", categoryId: "cat2" },
        ],
        products: [
          { id: "p1", title: "Basic Tee", price: 499, categoryId: "cat1", subcategoryId: "sub1" },
        ],
        orders: [],
      };
      localStorage.setItem(MOCK_LS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { categories: [], subcategories: [], products: [], orders: [] };
  }
}

function saveMockData(data) {
  localStorage.setItem(MOCK_LS_KEY, JSON.stringify(data));
}

function setupMockAdapter() {
  const mock = new MockAdapter(api, { delayResponse: 250 });
  // initialize
  let state = loadMockData();

  // helpers
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Categories
  mock.onGet("/categories").reply(() => [200, state.categories]);
  mock.onPost("/categories").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.categories.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/categories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.categories = state.categories.map((c) => (c._id === id ? { ...c, ...body } : c));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/categories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.categories = state.categories.filter((c) => c._id !== id);
    // also detach subcategories & products
    state.subcategories = state.subcategories.map((s) => (s.categoryId === id ? { ...s, categoryId: "" } : s));
    state.products = state.products.map((p) => (p.categoryId === id ? { ...p, categoryId: "", subcategoryId: "" } : p));
    saveMockData(state);
    return [204];
  });

  // Subcategories
  mock.onGet("/subcategories").reply(() => [200, state.subcategories]);
  mock.onPost("/subcategories").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.subcategories.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/subcategories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.subcategories = state.subcategories.map((s) => (s._id === id ? { ...s, ...body } : s));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/subcategories\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.subcategories = state.subcategories.filter((s) => s._id !== id);
    state.products = state.products.map((p) => (p.subcategoryId === id ? { ...p, subcategoryId: "" } : p));
    saveMockData(state);
    return [204];
  });

  // Products
  mock.onGet("/products").reply(() => [200, state.products]);
  mock.onPost("/products").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.products.push(item);
    saveMockData(state);
    return [201, item];
  });
  mock.onPut(/\/products\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    const body = JSON.parse(config.data);
    state.products = state.products.map((p) => (p._id === id ? { ...p, ...body } : p));
    saveMockData(state);
    return [200, { id, ...body }];
  });
  mock.onDelete(/\/products\/.+/).reply((config) => {
    const id = config.url.split("/").pop();
    state.products = state.products.filter((p) => p._id !== id);
    saveMockData(state);
    return [204];
  });

  // Orders (read-only seed + simple create)
  mock.onGet("/orders").reply(() => [200, state.orders]);
  mock.onPost("/orders").reply((config) => {
    const body = JSON.parse(config.data);
    const item = { id: uid(), ...body };
    state.orders.push(item);
    saveMockData(state);
    return [201, item];
  });

  return mock;
}

// call the mock setup. Remove this if you will use a real backend.
// setupMockAdapter();