const filterOriginList = (dataLists, value) => dataLists.filter(
  (el) => el.value.label.toLowerCase().indexOf(value.toLowerCase()) !== -1,
);

export const filterSortLists = (dataListFilter, currentCase) => {
  const resultCurrent = dataListFilter.filter(
    (element) => element.value.case === currentCase,
  );
  const resultCurrentSortFavoris = resultCurrent.sort(
    (a, b) => a.value.favorite < b.value.favorite,
  );
  const resultOtherCase = dataListFilter.filter(
    (element) => element.value.case !== currentCase,
  );
  const resultOtherCaseSortFavoris = resultOtherCase.sort(
    (a, b) => a.value.favorite < b.value.favorite,
  );
  return {
    currentCase: resultCurrentSortFavoris,
    otherCase: resultOtherCaseSortFavoris,
  };
};

export default filterOriginList;
