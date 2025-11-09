import { act, fireEvent, waitFor } from "@testing-library/react";
import { expect } from "vitest";

/**
 * Write a value to a text field and wait for the value to be set.
 */
export const writeField = async (field: HTMLElement, value: string, expectValue: string = value) => {
  act(() => {
    fireEvent.blur(field);
    fireEvent.change(field, { target: { value: value } });
    fireEvent.blur(field);
  });

  await waitFor(() => {
    expect((field as HTMLInputElement).value).toBe(expectValue);
  });
};
