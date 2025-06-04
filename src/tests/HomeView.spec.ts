// vi.hoisted
// vi.mock
import {describe, it, expect, vi, type Mocked} from "vitest";
import {mount} from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import itemFactory from "@/tests/factories/itemFactory.ts";
import Wrapper, {IndexDBWrapper} from "@/Types/IndexDBWrapper.ts";

const mockedIndexedWrapper = new IndexDBWrapper()

export const { db } = Wrapper as Mocked<typeof Wrapper>;
vi.mock("@/Types/IndexDBWrapper.ts");

describe("HomeView", () => {
  it("renders the HomeView component", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBeTruthy();
  });

  it("retrieves data on initial load", () => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push(itemFactory())
    }
    // TODO: We are here
    mockedIndexedWrapper.open.mockImplementation(() => {
      return new Promise((resolve) => { resolve(); });
    })
    db.mockImplementation(() => mockedIndexedWrapper);
    const wrapper = mount(HomeView);
    // call the open() on db wrapper

    // that should retrieve items

    // expect items to be there
  });
})
