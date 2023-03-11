import "@testing-library/jest-dom";

// Mock Next.js' router
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: {},
    basePath: "",
    asPath: "",
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  })),
}));
