'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Loading } from '@/components/loading';
import { ON_PAGE } from '@/utils/constants';
import { TJob } from '@/lib/types';
import { Tag } from '../tag/Tag';
import { FollowUs } from '../followUs/FollowUs';
import { VacancyCard } from './vacancyCard/VacancyCard';
import { PaginationComp } from '../pagination/Pagination';
import s from './Vacancies.module.scss';
import { setTags } from '@/lib/slices/tagsSlice';
import { setJobs } from '@/lib/slices/jobsSlice';


export const Vacancies = ({ data }: {
  data: {
    allRecords: TJob[];
    uniqueTags: string[]
  }
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTags(data.uniqueTags));
    dispatch(setJobs(data.allRecords))
    // dispatch(setIsFetched(isFetchedS))
    // dispatch(setIsError(isErrorS))
  }, [data])

  const router = useSearchParams();
  const jobsArray = useSelector((state: RootState) => state.jobs.jobs);

  const filtering = (arr: TJob[]) => {
    return arr.slice(
      currentPage === 1 ? 0 : (currentPage * ON_PAGE) - ON_PAGE,
      currentPage === 1 ? ON_PAGE : (currentPage * ON_PAGE)
    );
  };

  const [isLoading, setIsLoading] = useState(true);
  const [currentTag, setCurrentTag] = useState<string>(router.get('tag') || '');
  const [currentPage, setCurrentPage] = useState<number>(
    router.get('page') ? Number(router.get('page')) : 1
  );
  const [filteredArray, setFilteredArray] = useState<TJob[]>(jobsArray);
  const [currentJobsArray, setCurrentJobsArray] = useState<TJob[]>([]);


  useEffect(() => {

    // setIsLoading(true); // Установка isLoading в true перед запросом данных

      setCurrentPage(router.get('page') ? Number(router.get('page')) : 1);
      setCurrentTag(router.get('tag') || '');
      // console.log(job)

      const queryTag: string = router.get('tag') || '';
      const filteredByTag = jobsArray.filter(job => {
        return queryTag !== '' ? job.fields.Tags?.some(tag => tag.toLowerCase() === queryTag.toLowerCase()) : true;
      });
      setFilteredArray(filteredByTag);

      setIsLoading(false); 

      // Установка isLoading в false после получения данных


      // setIsLoading(false); // Установка isLoading в false после получения данных



  }, [router, jobsArray]);

  useEffect(() => {
    setCurrentJobsArray(filtering(filteredArray));
  }, [currentPage, filteredArray]);


  return (
    <section className={`${s.container} container`}>
      <p className={s.vacancies__title}>
        {currentTag === '' ? 'All' : currentTag} jobs, All locations
      </p>
      {currentTag !== '' &&
        <div className={s.vacancies__tag}>
          <Tag value={typeof currentTag === 'object' ? currentTag[0] : currentTag} />
        </div>
      }

      {/* isError ?  */}
      {/* <p className={s.vacancies__title} style={{ textAlign: 'center' }}> Oops... Smth went wrong</p> : */}
      {/* <Suspense fallback={<Loading />}> */}
      {/* {isLoading ? <Loading /> : */}
      <Suspense fallback={<Loading />}>

        <div className={s.vacancies}>
          {
            currentJobsArray.slice(0, 2).map((vacancy => (
              <VacancyCard key={vacancy.id} cardInfo={vacancy} />
            )))
          }
          {
            // !isError && 
            currentPage === 1
            && < FollowUs mode='light' />
          }
          {
            currentJobsArray.slice(2, ON_PAGE).map((vacancy => (
              <VacancyCard key={vacancy.id} cardInfo={vacancy} />
            )))
          }

        </div>
      </Suspense>

      {/* } */}
      {/* } */}

      {filteredArray.length > 15 &&
        <PaginationComp arr={filteredArray} />}


    </section>
  )
}
