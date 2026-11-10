import { throttle } from 'lodash';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import useMeasure from 'Helpers/Hooks/useMeasure';
import Series from 'Series/Series';
import dimensions from 'Styles/Variables/dimensions';
import getIndexOfFirstCharacter from 'Utilities/Array/getIndexOfFirstCharacter';
import SeriesIndexPartyRow, { PARTY_ROW_HEIGHT } from './SeriesIndexPartyRow';

const bodyPadding = parseInt(dimensions.pageContentBodyPadding);
const bodyPaddingSmallScreen = parseInt(
  dimensions.pageContentBodyPaddingSmallScreen
);

interface RowItemData {
  items: Series[];
  isSelectMode: boolean;
}

interface SeriesIndexPartyProps {
  items: Series[];
  sortKey: string;
  sortDirection?: string;
  jumpToCharacter?: string;
  scrollTop?: number;
  scrollerRef: RefObject<HTMLElement>;
  isSelectMode: boolean;
  isSmallScreen: boolean;
}

function Row({ index, style, data }: ListChildComponentProps<RowItemData>) {
  const { items, isSelectMode } = data;

  if (index >= items.length) {
    return null;
  }

  return (
    <div style={style}>
      <SeriesIndexPartyRow
        seriesId={items[index].id}
        isSelectMode={isSelectMode}
      />
    </div>
  );
}

function getWindowScrollTopPosition() {
  return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// Midgar's default series view: the library as an FFVII party list.
function SeriesIndexParty(props: SeriesIndexPartyProps) {
  const { items, jumpToCharacter, scrollerRef, isSelectMode, isSmallScreen } =
    props;

  const listRef = useRef<List>(null);
  const [measureRef, bounds] = useMeasure();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const current = scrollerRef.current as HTMLElement;

    if (isSmallScreen) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      return;
    }

    if (current) {
      const padding =
        (isSmallScreen ? bodyPaddingSmallScreen : bodyPadding) - 5;

      setSize({
        width: current.clientWidth - padding * 2,
        height: window.innerHeight,
      });
    }
  }, [isSmallScreen, scrollerRef, bounds]);

  useEffect(() => {
    const currentScrollerRef = scrollerRef.current as HTMLElement;
    const currentScrollListener = isSmallScreen ? window : currentScrollerRef;

    const handleScroll = throttle(() => {
      const { offsetTop = 0 } = currentScrollerRef;
      const scrollTop =
        (isSmallScreen
          ? getWindowScrollTopPosition()
          : currentScrollerRef.scrollTop) - offsetTop;

      listRef.current?.scrollTo(scrollTop);
    }, 10);

    currentScrollListener.addEventListener('scroll', handleScroll);

    return () => {
      handleScroll.cancel();
      currentScrollListener?.removeEventListener('scroll', handleScroll);
    };
  }, [isSmallScreen, listRef, scrollerRef]);

  useEffect(() => {
    if (!jumpToCharacter) {
      return;
    }

    const index = getIndexOfFirstCharacter(items, jumpToCharacter);

    if (index != null) {
      let scrollTop = index * PARTY_ROW_HEIGHT;

      if (scrollTop > 0) {
        scrollTop += 57;
      }

      listRef.current?.scrollTo(scrollTop);
      scrollerRef.current?.scrollTo(0, scrollTop);
    }
  }, [jumpToCharacter, items, scrollerRef, listRef]);

  return (
    <div ref={measureRef}>
      <List<RowItemData>
        ref={listRef}
        style={{ width: '100%', height: '100%', overflow: 'none' }}
        width={size.width}
        height={size.height}
        itemCount={items.length}
        itemSize={PARTY_ROW_HEIGHT}
        itemData={{ items, isSelectMode }}
      >
        {Row}
      </List>
    </div>
  );
}

export default SeriesIndexParty;
