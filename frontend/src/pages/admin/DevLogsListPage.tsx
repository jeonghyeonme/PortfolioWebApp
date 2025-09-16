import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { getDevLogs, deleteDevLog } from '../../services/devlogs';
import { Toaster, toast } from 'sonner';

interface DevLog {
  id: number;
  title: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function DevLogsListPage() {
  const [devLogs, setDevLogs] = useState<DevLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDevLogs = async () => {
    try {
      const data = await getDevLogs();
      setDevLogs(data);
    } catch (error) {
      toast.error('개발 로그 목록을 불러오는 데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevLogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 개발 로그를 삭제하시겠습니까?')) {
      try {
        await deleteDevLog(id);
        toast.success('개발 로그가 성공적으로 삭제되었습니다.');
        fetchDevLogs(); // Refresh the list
      } catch (error) {
        toast.error('개발 로그 삭제에 실패했습니다.');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="p-8">개발 로그 목록을 불러오는 중...</div>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">개발 로그 관리</h1>
            <p className="text-muted-foreground">모든 개발 로그를 확인하고 관리하세요.</p>
          </div>
          <Button onClick={() => navigate('/admin/devlogs/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 로그 작성
          </Button>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead>수정일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devLogs.length > 0 ? (
                  devLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.title}</TableCell>
                      <TableCell>
                        <Badge variant={log.published ? 'default' : 'secondary'}>
                          {log.published ? '발행됨' : '초안'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell>{new Date(log.updated_at).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/devlogs/edit/${log.id}`)}>
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(log.id)} className="text-red-500">
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      개발 로그가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
