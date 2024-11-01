import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../types/types";
import { Link } from "react-router-dom";
import he from "he";

export default function Main() {
  const posts = useSelector((state: RootState) => state.posts);
  const initialValue = { search: "", filter: [] as postTypes[] };
  const [value, setValue] = useState(initialValue);

  const regexFilter = /^\w/i;

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(regexFilter)) {
      const regex = new RegExp(`^${e.target.value}`, "i");
      const result = posts.filter((post) => post.title.match(regex));
      setValue({ search: e.target.value, filter: result });
    } else {
      setValue(initialValue);
    }
  };

  return (
    <div className="mb-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative mx-4 rounded-lg border border-solid border-slate-200 max-lg:mt-16"
      >
        <button className="absolute left-0 top-1/2 -translate-y-1/2 rounded-l-md px-2 py-2 hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-purple-500 dark:hover:text-white">
          <SearchOutlinedIcon />
        </button>

        <input
          onChange={onchange}
          className="h-10 w-full appearance-none rounded-lg py-1 pl-12 pr-2 outline-none ring-2 ring-slate-200 focus:ring-2 focus:ring-blue-500 dark:text-white dark:ring-purple-100 dark:focus:ring-purple-500"
          type="text"
          placeholder="Search..."
        />
      </form>
      {value.filter.length > 0 && (
        <div className="mx-4 mt-2 border border-solid border-slate-200 bg-white dark:bg-slate-800">
          <FilteredPosts posts={value.filter} />
        </div>
      )}
    </div>
  );
}

function FilteredPosts({ posts }: { posts: postTypes[] }) {
  return posts.map((post, index) => (
    <Link to={`/posts/post/${post._id}`} key={index}>
      <div className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-purple-500">
        <p className="mb-[-0.1rem] font-bold">{he.decode(post.title)}</p>
        <span className="text-sm text-slate-500 dark:text-slate-300">
          {post.date}
        </span>
      </div>
    </Link>
  ));
}
