// vi.hoisted
// vi.mock
import {describe, it, expect, vi, type Mocked, beforeEach} from "vitest";
import {flushPromises, mount} from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import itemFactory from "@/tests/factories/itemFactory.ts";
import Wrapper, {IndexDBWrapper} from "@/Types/IndexDBWrapper.ts";
import type {Item} from "@/Types/Item.ts";

const mockedIndexedWrapper = new IndexDBWrapper()

export const { db } = Wrapper as Mocked<typeof Wrapper>;
vi.mock("@/Types/IndexDBWrapper.ts");

describe("HomeView", () => {
  beforeEach(() => {
    mockedIndexedWrapper.open.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve();
      });
    })
    db.mockImplementation(() => mockedIndexedWrapper);
  })

  it("renders the HomeView component", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBeTruthy();
  });

  it("retrieves data on initial load", async () => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push(itemFactory())
    }
    mockedIndexedWrapper.getAll.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(items);
      })
    })

    const wrapper = mount(HomeView);
    await flushPromises();

    items.forEach(item => {
      expect(wrapper.find(`[id="${item.id}-input"]`).exists()).toBeTruthy();
    })
  });

  it("will add a new item to our list and retrieve all items", async () => {
    const item = itemFactory();
    mockedIndexedWrapper.getAll.mockImplementation(() => {
      return new Promise((resolve) => {
        console.log("populated stuff")
        resolve([item]);
      })
    })
    mockedIndexedWrapper.getAll.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        console.log("empty stuff")
        resolve([]);
      })
    })
    mockedIndexedWrapper.add.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(item);
      })
    })

    const wrapper = mount(HomeView);

    const addInput = wrapper.find('[id="add-input"]')
    await addInput.setValue(item.value)

    const addButton = wrapper.find('[id="add-button"]')
    await addButton.trigger('click');

    await flushPromises();

    expect(wrapper.find(`[id="${item.id}-input"]`).exists()).toBeTruthy();
  });
})
