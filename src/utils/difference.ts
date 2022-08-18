import { ProductProp } from "./../model/Schema/ProductProp.js";

interface Difference {
  key: string;
  old:
    | string
    | number
    | boolean
    | (string | number)[]
    | { url: string; desc: string };
  recent:
    | string
    | number
    | boolean
    | (string | number)[]
    | { url: string; desc: string };
}

type CompareParams = Pick<
  ProductProp,
  | "name" | "categories" | "images" | "isCOD" | "prices" | "originalUrl"
>;

export const getNameDifference = (newname: string, oldname: string) => {
  let diff = <Difference[]>[];
  if (newname !== oldname) {
    diff.push({
      key: "name",
      old: oldname,
      recent: newname,
    });
  }
  return diff;
};

export const getImagesDifference = (
  images: { desc: string; url: string }[],
  images2: { desc: string; url: string }[]
) => {
  let diff = <Difference[]>[];
  let newImages = images.map((i) => ({ url: i.url, desc: i.desc }));
  let newImages2 = images2.map((i) => ({ url: i.url, desc: i.desc }));

  if (newImages.length !== newImages2.length)
    diff.push({
      key: "image length",
      old: newImages2.length,
      recent: newImages.length,
    });

  for (let i = 0; i < newImages.length; i++) {
    if (JSON.stringify(newImages[i]) !== JSON.stringify(newImages2[i])) {
      diff.push({
        key: "image variation",
        old: newImages2[i],
        recent: newImages[i],
      });
    }
  }

  return diff;
};

export const getIsCODDifference = (newcod: boolean, oldcod: boolean) => {
  let diff = <Difference[]>[];

  if (newcod !== oldcod) {
    diff.push({
      key: "cod status",
      old: oldcod,
      recent: newcod,
    });
  }

  return diff;
};

export const getCategoriesDifference = (
  newcats: string[],
  oldcats: string[]
) => {
  let diff = <Difference[]>[];

  if (JSON.stringify(newcats.sort()) !== JSON.stringify(oldcats.sort())) {
    diff.push({
      key: "category",
      old: oldcats,
      recent: newcats,
    });
  }

  return diff;
};

export const getPricesDifference = (newprice: number[], oldprice: number[]) => {
  let diff = <Difference[]>[];

  if (JSON.stringify(newprice) !== JSON.stringify(oldprice)) {
    diff.push({
      key: "price",
      old: oldprice,
      recent: newprice,
    });
  }

  return diff;
};

export const getOriURLDifference = (newurl: string, oldurl: string) => {
  let diff = <Difference[]>[];

  if (newurl !== oldurl) {
    diff.push({
      key: "original url",
      old: oldurl,
      recent: newurl,
    });
  }

  return diff;
};

// main function
export const getTheDifference = (
  newparams: CompareParams,
  oldparams: CompareParams
) => {
  let diff = <Difference[]>[];

  diff = [...diff, ...getNameDifference(newparams.name, oldparams.name)];
  diff = [...diff, ...getImagesDifference(newparams.images, oldparams.images)];
  diff = [...diff, ...getIsCODDifference(newparams.isCOD, oldparams.isCOD)];
  diff = [
    ...diff,
    ...getCategoriesDifference(newparams.categories, oldparams.categories),
  ];
  diff = [...diff, ...getPricesDifference(newparams.prices, oldparams.prices)];
  diff = [
    ...diff,
    ...getOriURLDifference(newparams.originalUrl, oldparams.originalUrl),
  ];

  return diff;
};
