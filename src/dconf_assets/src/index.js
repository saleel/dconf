import { dconf } from "../../declarations/dconf";

document.getElementById("formget").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btnGet = e.target.querySelector("button");
  const getKey = document.getElementById("getKey").value.toString();
  btnGet.setAttribute("disabled", true);
  const greeting = await dconf.get(getKey);
  btnGet.removeAttribute("disabled");
  document.getElementById("greeting").innerText = greeting;

  return false;
});


document.getElementById("formset").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btnSet = e.target.querySelector("button");
  const key = document.getElementById("key").value.toString();
  const value = document.getElementById("value").value.toString();
  btnSet.setAttribute("disabled", true);
  await dconf.set(key, value);
  btnSet.removeAttribute("disabled");

  return false;
});
