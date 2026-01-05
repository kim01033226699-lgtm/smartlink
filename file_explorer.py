import tkinter as tk
from tkinter import filedialog, messagebox
import os
import pandas as pd
import openpyxl

class FileExplorer:
    def __init__(self, root):
        self.root = root
        self.root.title("파일 탐색기")
        self.root.geometry("600x400")
        
        self.current_file = None
        self.current_directory = os.getcwd()
        
        self.create_widgets()
    
    def create_widgets(self):
        # 상단 프레임
        top_frame = tk.Frame(self.root)
        top_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # 파일 선택 버튼
        select_btn = tk.Button(top_frame, text="파일 선택", command=self.select_file)
        select_btn.pack(side=tk.LEFT, padx=5)
        
        # 저장 위치 설정 버튼
        save_dir_btn = tk.Button(top_frame, text="저장 위치 설정", command=self.set_save_directory)
        save_dir_btn.pack(side=tk.LEFT, padx=5)
        
        # 파일 열기 버튼
        open_btn = tk.Button(top_frame, text="파일 열기", command=self.open_file)
        open_btn.pack(side=tk.LEFT, padx=5)
        
        # 엑셀 처리 버튼
        excel_btn = tk.Button(top_frame, text="엑셀 1-10행 삭제", command=self.process_excel)
        excel_btn.pack(side=tk.LEFT, padx=5)
        
        # 현재 경로 레이블
        self.path_label = tk.Label(top_frame, text=f"현재 경로: {self.current_directory}")
        self.path_label.pack(side=tk.LEFT, padx=20)
        
        # 파일 정보 프레임
        info_frame = tk.Frame(self.root)
        info_frame.pack(fill=tk.X, padx=5, pady=5)
        
        self.file_info_label = tk.Label(info_frame, text="선택된 파일: 없음")
        self.file_info_label.pack(side=tk.LEFT)
        
        # 텍스트 에디터
        self.text_area = tk.Text(self.root, wrap=tk.WORD, undo=True)
        self.text_area.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # 스크롤바
        scrollbar = tk.Scrollbar(self.text_area)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.text_area.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=self.text_area.yview)
        
        # 하단 버튼 프레임
        bottom_frame = tk.Frame(self.root)
        bottom_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # 저장 버튼
        save_btn = tk.Button(bottom_frame, text="저장", command=self.save_file)
        save_btn.pack(side=tk.LEFT, padx=5)
        
        # 다른 이름으로 저장 버튼
        save_as_btn = tk.Button(bottom_frame, text="다른 이름으로 저장", command=self.save_file_as)
        save_as_btn.pack(side=tk.LEFT, padx=5)
        
        # 새로 만들기 버튼
        new_btn = tk.Button(bottom_frame, text="새로 만들기", command=self.new_file)
        new_btn.pack(side=tk.LEFT, padx=5)
    
    def select_file(self):
        file_path = filedialog.askopenfilename(
            title="파일 선택",
            initialdir=self.current_directory,
            filetypes=[
                ("모든 파일", "*.*"),
                ("텍스트 파일", "*.txt"),
                ("파이썬 파일", "*.py"),
                ("JSON 파일", "*.json"),
                ("CSV 파일", "*.csv"),
                ("엑셀 파일", "*.xlsx"),
                ("엑셀 파일", "*.xls")
            ]
        )
        
        if file_path:
            self.current_file = file_path
            self.current_directory = os.path.dirname(file_path)
            self.path_label.config(text=f"현재 경로: {self.current_directory}")
            self.file_info_label.config(text=f"선택된 파일: {os.path.basename(file_path)}")
            self.load_file_content(file_path)
    
    def set_save_directory(self):
        directory = filedialog.askdirectory(
            title="저장 위치 선택",
            initialdir=self.current_directory
        )
        
        if directory:
            self.current_directory = directory
            self.path_label.config(text=f"현재 경로: {self.current_directory}")
            messagebox.showinfo("성공", f"저장 위치가 {directory}로 설정되었습니다.")
    
    def open_file(self):
        if self.current_file:
            self.load_file_content(self.current_file)
        else:
            file_path = filedialog.askopenfilename(
                title="파일 열기",
                initialdir=self.current_directory
            )
            if file_path:
                self.current_file = file_path
                self.current_directory = os.path.dirname(file_path)
                self.path_label.config(text=f"현재 경로: {self.current_directory}")
                self.file_info_label.config(text=f"선택된 파일: {os.path.basename(file_path)}")
                self.load_file_content(file_path)
    
    def load_file_content(self, file_path):
        try:
            # 여러 인코딩 시도
            encodings = ['utf-8', 'cp949', 'euc-kr', 'latin-1']
            content = None
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as file:
                        content = file.read()
                        break
                except UnicodeDecodeError:
                    continue
            
            if content is not None:
                self.text_area.delete(1.0, tk.END)
                self.text_area.insert(1.0, content)
                self.file_info_label.config(text=f"선택된 파일: {os.path.basename(file_path)}")
            else:
                messagebox.showerror("오류", "파일을 읽을 수 있는 인코딩을 찾지 못했습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"파일을 열 수 없습니다: {str(e)}")
    
    def save_file(self):
        if self.current_file:
            try:
                content = self.text_area.get(1.0, tk.END)
                with open(self.current_file, 'w', encoding='utf-8') as file:
                    file.write(content)
                messagebox.showinfo("성공", "파일이 저장되었습니다.")
            except Exception as e:
                messagebox.showerror("오류", f"파일을 저장할 수 없습니다: {str(e)}")
        else:
            self.save_file_as()
    
    def save_file_as(self):
        file_path = filedialog.asksaveasfilename(
            title="다른 이름으로 저장",
            initialdir=self.current_directory,
            defaultextension=".txt",
            filetypes=[
                ("텍스트 파일", "*.txt"),
                ("파이썬 파일", "*.py"),
                ("JSON 파일", "*.json"),
                ("CSV 파일", "*.csv"),
                ("모든 파일", "*.*")
            ]
        )
        
        if file_path:
            try:
                content = self.text_area.get(1.0, tk.END)
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(content)
                self.current_file = file_path
                self.current_directory = os.path.dirname(file_path)
                self.path_label.config(text=f"현재 경로: {self.current_directory}")
                self.file_info_label.config(text=f"선택된 파일: {os.path.basename(file_path)}")
                messagebox.showinfo("성공", "파일이 저장되었습니다.")
            except Exception as e:
                messagebox.showerror("오류", f"파일을 저장할 수 없습니다: {str(e)}")
    
    def new_file(self):
        self.text_area.delete(1.0, tk.END)
        self.current_file = None
        self.file_info_label.config(text="선택된 파일: 없음")
    
    def process_excel(self):
        if not self.current_file or not (self.current_file.endswith('.xlsx') or self.current_file.endswith('.xls')):
            messagebox.showwarning("경고", "엑셀 파일을 먼저 선택해주세요.")
            return
        
        try:
            # 엑셀 파일 읽기
            df = pd.read_excel(self.current_file)
            
            # 1-10행 삭제 (인덱스 0-9)
            if len(df) > 10:
                df_processed = df.iloc[10:].reset_index(drop=True)
            else:
                messagebox.showwarning("경고", "파일에 10행 이상의 데이터가 없습니다.")
                return
            
            # 저장할 파일명 선택
            save_path = filedialog.asksaveasfilename(
                title="처리된 엑셀 파일 저장",
                initialdir=self.current_directory,
                defaultextension=".xlsx",
                filetypes=[
                    ("엑셀 파일", "*.xlsx"),
                    ("모든 파일", "*.*")
                ]
            )
            
            if save_path:
                # 처리된 파일 저장
                df_processed.to_excel(save_path, index=False)
                messagebox.showinfo("성공", f"1-10행이 삭제된 파일이 {save_path}에 저장되었습니다.")
                
                # 새 파일 정보 업데이트
                self.current_file = save_path
                self.current_directory = os.path.dirname(save_path)
                self.path_label.config(text=f"현재 경로: {self.current_directory}")
                self.file_info_label.config(text=f"선택된 파일: {os.path.basename(save_path)}")
                
        except Exception as e:
            messagebox.showerror("오류", f"엑셀 파일 처리 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = FileExplorer(root)
    root.mainloop()