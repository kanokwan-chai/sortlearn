import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Lessons from "../pages/LessonList";
import PreTest from "../pages/PreTest";
import PostTest from "../pages/Posttest";
import Video from "../pages/Video";
import GameList from "../pages/GameList";
import NotFound from "../pages/NotFound"; // ✅ ตรวจสอบไฟล์นี้ว่ามี export default หรือไม่
import AdminDashboard from "../pages/AdminDashboard"; 

import SelectionSort from "../pages/SelectionSort";
import InsertionSort from "../pages/InsertionSort";
import BubbleSort from "../pages/BubbleSort";
import HeapSort from "../pages/HeapSort";
import QuickSort from "../pages/QuickSort";
import MergeSort from "../pages/MergeSort";


import SelectionTest from "../pages/pretest/SelectionTest";
import InsertionTest from "../pages/pretest/InsertionTest";
import BubbleTest from "../pages/pretest/BubbleTest";
import HeapTest from "../pages/pretest/HeapTest";
import QuickTest from "../pages/pretest/QuickTest";
import MergeTest from "../pages/pretest/MergeTest";


import VideoSelection from "../pages/videos/VideoSelection";
import VideoInsertion from "../pages/videos/VideoInsertion";
import VideoBubble from "../pages/videos/VideoBubble";
import VideoHeap from "../pages/videos/VideoHeap";
import VideoQuick from "../pages/videos/VideoQuick";
import VideoMerge from "../pages/videos/VideoMerge";


import SelectionGame from "../pages/games/SelectionGame";
import InsertionGame from "../pages/games/InsertionGame";
import BubbleSortGame from "../pages/games/BubbleSortGame";
import HeapSortGame from "../pages/games/HeapSortGame";
import QuickSortGame from "../pages/games/QuickSortGame";
import MergeSortGame from "../pages/games/MergeSortGame";
                                                                                                                                  


import SelectionPosttest from "../pages/posttest/SelectionPosttest"; 
import InsertionPosttest from "../pages/posttest/InsertionPosttest";
import BubblePosttest from "../pages/posttest/BubblePosttest";
import HeapPosttest from "../pages/posttest/HeapPosttest";
import QuickPosttest from "../pages/posttest/QuickPosttest";
import MergePosttest from "../pages/posttest/MergePosttest";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/pretest" element={<PreTest />} />
      <Route path="/posttest" element={<PostTest />} />
      <Route path="/videos" element={<Video />} />
      <Route path="/games" element={<GameList />} /> 
      <Route path="/admin" element={<AdminDashboard />} />

      {/* บทเรียน */}
      <Route path="/selection-sort" element={<SelectionSort />} />
      <Route path="/insertion-sort" element={<InsertionSort />} />
      <Route path="/bubble-sort" element={<BubbleSort />} />
      <Route path="/heap-sort" element={<HeapSort />} />
      <Route path="/quick-sort" element={<QuickSort />} />
      <Route path="/merge-sort" element={<MergeSort />} />

      {/* แบบทดสอบก่อนเรียน */}
      <Route path="/pretest/selection" element={<SelectionTest />} />
      <Route path="/pretest/insertion" element={<InsertionTest />} />
      <Route path="/pretest/bubble" element={<BubbleTest />} />
      <Route path="/pretest/heap" element={<HeapTest />} />
      <Route path="/pretest/quick" element={<QuickTest />} />
      <Route path="/pretest/merge" element={<MergeTest />} />

      {/* วิดีโอสาธิตการทำงานของอัลกอริทึม */}
      <Route path="/video/selection-sort" element={<VideoSelection />} />
      <Route path="/video/insertion-sort" element={<VideoInsertion />} />
      <Route path="/video/bubble-sort" element={<VideoBubble />} />
      <Route path="/video/heap-sort" element={<VideoHeap />} /> 
      <Route path="/video/quick-sort" element={<VideoQuick />} />
      <Route path="/video/merge-sort" element={<VideoMerge />} />

      {/* โซนเกม */}
      <Route path="/games/selection-sort" element={<SelectionGame />} />
      <Route path="/games/insertion-sort" element={<InsertionGame />} /> 
      <Route path="/games/bubble-sort" element={<BubbleSortGame />} /> 
      <Route path="/games/heap-sort" element={<HeapSortGame />} />
      <Route path="/games/quick-sort" element={<QuickSortGame />} />
      <Route path="/games/merge-sort" element={<MergeSortGame />} />


      {/* แบบทดสอบหลังเรียน */}
      <Route path="/posttest/selection" element={<SelectionPosttest />} />
      <Route path="/posttest/insertion" element={<InsertionPosttest />} />
      <Route path="/posttest/bubble" element={<BubblePosttest />} />
      <Route path="/posttest/heap" element={<HeapPosttest />} />
      <Route path="/posttest/quick" element={<QuickPosttest />} />
      <Route path="/posttest/merge" element={<MergePosttest />} />

      {/* หน้า 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}