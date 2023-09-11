<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StudyRecordController extends Controller
{
    public function getStudyTime(User $user) {

        $today = Carbon::today()->toDateString();
        $firstDayOfTheMonth = Carbon::now()->startOfMonth()->toDateString();
        //今日の勉強時間取得
        $todayHours = $user->studyLogs()->where('study_date', $today)->sum('study_hour');
        //今月の勉強時間取得
        $monthHours = $user->studyLogs()->whereBetween('study_date', [$firstDayOfTheMonth, $today])->sum('study_hour');
        //総合時間取得
        $totalHours = $user->studyLogs()->sum('study_hour');

        return response()->json([
            'today_hours' => $todayHours,
            'month_hours' => $monthHours,
            'totalHours' => $totalHours
        ]);

    }

    public function getDailyStudyTime(User $user, Request $request) {
        
        // 今日の日付を含めて7日前からのデータを取得
        // $ = Carbon::today()->toDateString();
        // $startWeekDate = Carbon::today()->subDays(6)->toDateString();
        $startDate = $request->has('start') ? Carbon::parse($request->input('start'))->toDateString() : Carbon::today()->subDays(6)->toDateString();
        $endDate = $request->has('end') ? Carbon::parse($request->input('end'))->toDateString() : Carbon::today()->toDateString();

        $weeklyLogs = $user->studyLogs()->with(['myMaterial.category'])
                ->whereBetWeen('study_date', [$startDate, $endDate])
                ->selectRaw('study_date, my_material_id, SUM(study_hour) as study_hour')
                ->groupBy('study_date','my_material_id')
                ->get()->toArray();

        
        if(count($weeklyLogs) === 0) {
            return response()->json([]);
        }
        // カテゴリごとにデータを整形
        $weeklyDataByCategory = [];

        foreach ($weeklyLogs as $log) {
            $categoryName = $log['my_material']['category']['category_name'];
            $studyDate = $log['study_date'];
            $categoryColor = $log['my_material']['category']['category_color'];

            if (!isset($weeklyDataByCategory[$categoryName])) {
                $weeklyDataByCategory[$categoryName] = [];
            }

            if (!isset($weeklyDataByCategory[$categoryName]['dates'][$studyDate])) {
                $weeklyDataByCategory[$categoryName]['dates'][$studyDate] = 0;
            }

            $weeklyDataByCategory[$categoryName]['dates'][$studyDate] += (int)$log['study_hour'];
            $weeklyDataByCategory[$categoryName]['category_color'] = $categoryColor;
        }

        // 指定された形式に整形
        $finalResponse = [];

        foreach ($weeklyDataByCategory as $categoryName => $row) {
            $data = [];

            for ($date = Carbon::parse($startDate); $date->lte(Carbon::parse($endDate)); $date->addDay()) {
                $formattedDate = $date->toDateString();

                $data[] = $row['dates'][$formattedDate] ?? 0;
            }

            $finalResponse[] = [
                'label' => $categoryName,
                'data' => $data,
                'backgroundColor' => $row['category_color'],
                'borderColor' => $row['category_color'],
                'borderWidth' => 1
            ];
        }
        return response()->json($finalResponse);
    }

    public function getWeeklyStudyTime(User $user, Request $request) {
        // リクエストから日付範囲を取得
        $endDate = $request->has('end') ? Carbon::parse($request->input('end'))->startOfDay() : Carbon::today()->startOfDay();
        $startDate = $endDate->clone()->subWeeks(6)->startOfWeek();

        $logs = $user->studyLogs()->with(['myMaterial.category'])
                ->whereBetWeen('study_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->selectRaw('WEEK(study_date, 1) as week_number, my_material_id, SUM(study_hour) as study_hour')
                ->groupBy('week_number', 'my_material_id')
                ->get()->toArray();

                // return response()->json($logs);

        if(count($logs) === 0) {
            return response()->json([]);
        }

        // カテゴリごとにデータを整形
        $dataByCategory = [];

        foreach ($logs as $log) {
            $categoryName = $log['my_material']['category']['category_name'];
            $weekNumber = $log['week_number'];
            $categoryColor = $log['my_material']['category']['category_color'];

            if (!isset($dataByCategory[$categoryName])) {
                $dataByCategory[$categoryName] = [];
            }
            // 同じ週、同じカテゴリであれば勉強時間を加算
            if (!isset($dataByCategory[$categoryName]['weeks'][$weekNumber])) {
                $dataByCategory[$categoryName]['weeks'][$weekNumber] = 0;
            }
            $dataByCategory[$categoryName]['weeks'][$weekNumber] += (int)$log['study_hour'];
            $dataByCategory[$categoryName]['category_color'] = $categoryColor;
        }

        // return response()->json($dataByCategory);

        // 指定された形式に整形
        $finalResponse = [];

        foreach ($dataByCategory as $categoryName => $row) {
            $currentWeek = $startDate->clone();
            $data = [];
            for ($i = 0; $i < 7; $i++) {
                $weekNumber = $currentWeek->weekOfYear;
                $data[] = $row['weeks'][$weekNumber] ?? 0;
                $currentWeek->addWeek();
            }

            $finalResponse[] = [
                'label' => $categoryName,
                'data' => $data,
                'backgroundColor' => $row['category_color'],
                'borderColor' => $row['category_color'],
                'borderWidth' => 1
            ];
        }
        return response()->json($finalResponse);
    }

    public function getMonthlyStudyTime(User $user, Request $request) {
        $endDate = $request->has('end') ? Carbon::parse($request->input('end'))->endOfMonth() : Carbon::today()->endOfMonth(); 
        $startDate = $endDate->clone()->subMonthsNoOverflow(6)->startOfMonth();


        $logs = $user->studyLogs()->with(['myMaterial.category'])
                ->whereBetWeen('study_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->selectRaw('YEAR(study_date) as year, MONTH(study_date) as month, my_material_id, SUM(study_hour) as study_hour')
                ->groupBy('year', 'month', 'my_material_id')
                ->get()->toArray();

        // return response()->json($logs);

        if(count($logs) === 0) {
            return response()->json([]);
        }

        // カテゴリごとにデータを整形
        $dataByCategory = [];

        foreach ($logs as $log) {
            $categoryName = $log['my_material']['category']['category_name'];
            $yearMonth = $log['year'] . '-' . $log['month'];
            $categoryColor = $log['my_material']['category']['category_color'];

            if (!isset($dataByCategory[$categoryName])) {
                $dataByCategory[$categoryName] = [];
            }
            // 同じ週、同じカテゴリであれば勉強時間を加算
            if (!isset($dataByCategory[$categoryName]['months'][$yearMonth])) {
                $dataByCategory[$categoryName]['months'][$yearMonth] = 0;
            }
            $dataByCategory[$categoryName]['months'][$yearMonth] += (int)$log['study_hour'];
            $dataByCategory[$categoryName]['category_color'] = $categoryColor;
        }

        // return response()->json($dataByCategory);

        // 指定された形式に整形
        $finalResponse = [];

        foreach ($dataByCategory as $categoryName => $row) {
            $currentMonth = $startDate->clone();
            $data = [];
            for ($i = 0; $i < 7; $i++) {
                $yearMonth = $currentMonth->year . '-' . $currentMonth->month;
                $data[] = $row['months'][$yearMonth] ?? 0;
                $currentMonth->addMonthsNoOverflow();
            }

            $finalResponse[] = [
                'label' => $categoryName,
                'data' => $data,
                'backgroundColor' => $row['category_color'],
                'borderColor' => $row['category_color'],
                'borderWidth' => 1
            ];
        }
        return response()->json($finalResponse);
    }


}
