// vi.hoisted
// vi.mock
import {describe, it, expect, vi, type Mocked, beforeEach} from "vitest";
import {flushPromises, mount} from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";
import itemFactory from "@/tests/factories/itemFactory.ts";
import Wrapper, {IndexDBWrapper} from "@/Types/IndexDBWrapper.ts";

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
        resolve([item]);
      })
    })
    mockedIndexedWrapper.getAll.mockImplementationOnce(() => {
      return new Promise((resolve) => {
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

  it('will update an item', async ()=> {
    const item = itemFactory();
    mockedIndexedWrapper.getAll.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([item]);
      })
    });

    const wrapper = mount(HomeView);

    await flushPromises();

    const itemInDom = wrapper.find(`[id="${item.id}-input"]`);

    // input's  text is in itemInDom.value (for current value of the input)
    // this itemInDom doesn't have anything on it
    // but retrieveAll() on mount should populate the input.value from db???
    // log of itemInDom.text() doesn't even trigger

    console.log(itemInDom);

    expect(itemInDom.exists()).toBeTruthy();
    expect(itemInDom.element.value).toBe(item.value);

    mockedIndexedWrapper.update.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve('new value');
      })
    });

    await itemInDom.setValue('new value');

    const updateButton = wrapper.find('[id="update-button"]')
    await updateButton.trigger('click');

    await flushPromises();

    expect(wrapper.find(`[id="${item.id}-input"]`).exists()).toBeTruthy();
    expect(itemInDom.element.value).toBe('new value');
  });

  it('will delete an item', async ()=> {
    const item = itemFactory();
    mockedIndexedWrapper.getAll.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([]);
      })
    });
    mockedIndexedWrapper.getAll.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([item]);
      })
    });

    const wrapper = mount(HomeView);

    await flushPromises();

    const itemInDom = wrapper.find(`[id="${item.id}-input"]`);

    expect(itemInDom.exists()).toBeTruthy();

    mockedIndexedWrapper.delete.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(item.id);
      })
    });

    const deleteButton = wrapper.find('[id="delete-button"]')
    await deleteButton.trigger('click');

    await flushPromises();

    expect(wrapper.find(`[id="${item.id}-input"]`).exists()).toBeFalsy;
  });
})
