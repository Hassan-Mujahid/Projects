"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";

const SearchFormReset = () => {
  const form = document.querySelector(".search-form") as HTMLFormElement;

  return (
    <button type="reset" onClick={() => form.reset()}>
      <Link href="/" className="search-btn text-white">
        <X className="size-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
