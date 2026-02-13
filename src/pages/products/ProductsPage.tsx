import { useEffect, useMemo, useRef, useState } from 'react';

import { ProductDraft, validateDraft } from '@/utils/validateDraft';
import { ProgressBar } from '@/components/progressBar/ProgressBar';
import { RefreshIcon } from './components/RefreshIcon';
import { SearchIcon } from './components/SearchIcon';
import { formatRating } from '@/utils/formatRating';
import { PlusIcon } from './components/PlusIcon';
import { DotsIcon } from './components/DotsIcon';
import { Popup } from '@/components/popup/Popup';
import { clampPage } from '@/utils/clampPage';
import { formatRub } from '@/utils/formatRub';
import { useDispatch } from '@/redux/hooks';
import { getProductsThunk, searchProductsThunk } from '@/redux/products/thunks';
import { Product, Products } from '@/axios/types';
import { TablePlusIcon } from './components/TablePlusIcon';
import { ArrowIcon } from './components/ArrowIcon';
import { Range } from './components/Range';

import s from '@/pages/products/ProductsPage.module.scss';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [popupOpen, setPopupOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>({ title: '', price: '', brand: '', sku: '' });
  const [draftErrors, setDraftErrors] = useState<Partial<Record<keyof ProductDraft, string>>>({});

  const requestSeq = useRef(0);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [limit, total]);
  const safePage = useMemo(() => clampPage(page, pages), [page, pages]);
  const skip = (safePage - 1) * limit;

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  useEffect(() => {
    let active = true;
    const seq = ++requestSeq.current;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = query.trim()
          ? await dispatch(searchProductsThunk({ query, limit, skip }))
          : await dispatch(getProductsThunk({ limit, skip }));
        if (!active) return;
        if (seq !== requestSeq.current) return;

        const payload = result.payload as Products;

        setProducts(payload.products);
        setTotal(payload.total);
      } catch (e) {
        if (!active) return;
        const msg =
          typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : 'Ошибка';
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };

    const handle = window.setTimeout(run, query.trim() ? 250 : 0);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [dispatch, limit, query, skip]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const openAdd = () => {
    setEditing(null);
    setDraft({ title: '', price: '', brand: '', sku: '' });
    setDraftErrors({});
    setPopupOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setDraft({
      title: p.title ?? '',
      price: String(p.price ?? ''),
      brand: p.brand ?? '',
      sku: p.sku ?? ''
    });
    setDraftErrors({});
    setPopupOpen(true);
  };

  const submitDraft = () => {
    const errs = validateDraft(draft);
    setDraftErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const next: Product = {
      id: editing ? editing.id : Date.now(),
      title: draft.title.trim(),
      price: Number(draft.price),
      brand: draft.brand.trim(),
      sku: draft.sku.trim(),
      rating: editing?.rating ?? 0
    };

    setProducts((prev) => {
      if (editing) return prev.map((p) => (p.id === editing.id ? { ...p, ...next } : p));
      return [next, ...prev];
    });
    setPopupOpen(false);
  };

  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const allChecked = products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someChecked = products.some((p) => selectedIds.has(p.id)) && !allChecked;
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!headerCheckboxRef.current) return;
    headerCheckboxRef.current.indeterminate = someChecked;
  }, [someChecked]);

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        products.forEach((p) => next.delete(p.id));
      } else {
        products.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goTo = (p: number) => setPage(clampPage(p, pages));

  const refresh = () => {
    requestSeq.current++;
    setLoading(true);
    setError(null);
    const seq = requestSeq.current;
    const run = async () => {
      try {
        const result = query.trim()
          ? await dispatch(searchProductsThunk({ query, limit, skip }))
          : await dispatch(getProductsThunk({ limit, skip }));
        if (seq !== requestSeq.current) return;
        const payload = result.payload as Products;

        setProducts(payload.products);
        setTotal(payload.total);
      } catch (e) {
        const msg =
          typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : 'Ошибка';
        setError(msg);
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    };
    void run();
  };

  return (
    <div className={s.products}>
      <div className={s.productsTopBar}>
        <div className={s.productsTopBar__title}>Товары</div>

        <div className={s.productsTopBar__search}>
          <div className={s.searchShell}>
            <div className={s.searchShell__icon}>
              <SearchIcon />
            </div>
            <input
              className={s.searchShell__input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти"
            />
          </div>
        </div>
      </div>

      {error ? <div className={s.errorBox}>{error}</div> : null}

      <div className={s.listCard}>
        <div className={s.listCard__header}>
          <div className={s.listCard__title}>Все позиции</div>
          <div className={s.listCard__actions}>
            <button className={s.ghostIconButton} type="button" aria-label="Обновить" onClick={refresh}>
              <RefreshIcon />
            </button>
            <button className={s.primaryButton} type="button" onClick={openAdd}>
              <span className={s.primaryButton__icon} aria-hidden="true">
                <PlusIcon />
              </span>
              Добавить
            </button>
          </div>
        </div>

        <div className={s.tableWrap}>
          {loading ? (
            <ProgressBar active={loading} />
          ) : (
            <table className={s.productsTable}>
              <thead>
                <tr>
                  <th className={`${s.th} ${s.th__check}`}>
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      aria-label="Выбрать всё"
                    />
                  </th>
                  <th className={s.th}>Наименование</th>
                  <th className={s.th}>Вендор</th>
                  <th className={s.th}>Артикул</th>
                  <th className={`${s.th} ${s.th__rating}`}>Оценка</th>
                  <th className={`${s.th} ${s.th__price}`}>Цена, ₽</th>
                  <th className={`${s.th} ${s.th__rowActions}`} />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const ratingBad = typeof p.rating === 'number' && p.rating < 3.5;
                  const checked = selectedIds.has(p.id);

                  return (
                    <tr key={p.id} className={`${s.tr} ${checked ? s.tr__selected : ''}`}>
                      <td className={`${s.td} ${s.td__check}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(p.id)}
                          aria-label={`Выбрать ${p.title}`}
                        />
                      </td>
                      <td className={s.td}>
                        <div className={s.nameCell}>
                          {p?.thumbnail ? (
                            <img className={s.nameCell__image} src={p.thumbnail} alt={p.title} />
                          ) : (
                            <div className={s.nameCell__thumb} />
                          )}
                          <div className={s.nameCell__text}>
                            <div className={s.nameCell__title}>{p.title}</div>
                            <div className={s.nameCell__sub}>{p.category ?? 'Аксессуары'}</div>
                          </div>
                        </div>
                      </td>
                      <td className={s.td}>
                        <span className={s.vendorText}>{p.brand ?? '—'}</span>
                      </td>
                      <td className={s.td}>
                        <span className={s.skuText}>{p.sku ?? `SKU-${p.id}`}</span>
                      </td>
                      <td className={`${s.td} ${s.td__rating} ${ratingBad ? s.td__bad : ''}`}>
                        {formatRating(p.rating)}
                      </td>
                      <td className={`${s.td} ${s.td__price}`}>{formatRub(p.price || 0)}</td>
                      <td className={`${s.td} ${s.td__rowActions}`}>
                        <div className={s.td__rowActions__container}>
                          <button
                            className={s.rowPillButton}
                            type="button"
                            aria-label="Действие"
                            onClick={() => openEdit(p)}
                          >
                            <TablePlusIcon />
                          </button>
                          <button
                            className={s.rowDotsButton}
                            type="button"
                            aria-label="Меню"
                            onClick={() => openEdit(p)}
                          >
                            <DotsIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && !loading ? (
                  <tr>
                    <td className={`${s.td} ${s.td__empty}`} colSpan={7}>
                      Ничего не найдено
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>

        <div className={s.listCard__footer}>
          <div className={s.rangeLabel}>
            <Range total={total} skip={skip} limit={limit} />
          </div>
          <div className={s.pager}>
            <button
              className={s.pager__arrow}
              type="button"
              onClick={() => goTo(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="Назад"
            >
              <ArrowIcon />
            </button>
            {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
              const p = i + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  className={`${s.pager__page} ${active ? s.pager__page__active : ''}`}
                  type="button"
                  onClick={() => goTo(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className={s.pager__arrow__right}
              type="button"
              onClick={() => goTo(safePage + 1)}
              disabled={safePage >= pages}
              aria-label="Вперёд"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      <Popup
        title={editing ? 'Редактирование товара' : 'Добавление товара'}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      >
        <div className={s.formGrid}>
          <label className={s.field}>
            <div className={s.field__label}>Наименование</div>
            <input
              className={`${s.field__input} ${draftErrors.title ? s.field__input__error : ''}`}
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
            {draftErrors.title ? <div className={s.field__error}>{draftErrors.title}</div> : null}
          </label>

          <label className={s.field}>
            <div className={s.field__label}>Цена</div>
            <input
              className={`${s.field__input} ${draftErrors.price ? s.field__input__error : ''}`}
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              inputMode="decimal"
            />
            {draftErrors.price ? <div className={s.field__error}>{draftErrors.price}</div> : null}
          </label>

          <label className={s.field}>
            <div className={s.field__label}>Вендор</div>
            <input
              className={`${s.field__input} ${draftErrors.brand ? s.field__input__error : ''}`}
              value={draft.brand}
              onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
            />
            {draftErrors.brand ? <div className={s.field__error}>{draftErrors.brand}</div> : null}
          </label>

          <label className={s.field}>
            <div className={s.field__label}>Артикул</div>
            <input
              className={`${s.field__input} ${draftErrors.sku ? s.field__input__error : ''}`}
              value={draft.sku}
              onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))}
            />
            {draftErrors.sku ? <div className={s.field__error}>{draftErrors.sku}</div> : null}
          </label>

          <div className={s.formActions}>
            <button className={s.secondaryButton} type="button" onClick={() => setPopupOpen(false)}>
              Отмена
            </button>
            <button className={s.primaryButton} type="button" onClick={submitDraft}>
              {editing ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};
