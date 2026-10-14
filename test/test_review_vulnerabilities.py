# ==============================================================================
# TEST FILE FOR AI PR REVIEW BOT (Python Security & Anti-Patterns)
# ==============================================================================
# This file intentionally contains dangerous Python patterns, SQL injection,
# and insecure deserialization to verify automated PR code review capabilities.

import sqlite3
import pickle
import os

# 1. DANGEROUS: SQL Injection via direct string formatting
def query_user_by_email(db_path, user_email):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Vulnerability: string formatting bypasses parameterized query protection
    query = f"SELECT * FROM users WHERE email = '{user_email}'"
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results

# 2. DANGEROUS: Insecure Deserialization via pickle
def load_cached_resume(serialized_data):
    # Vulnerability: Arbitrary code execution if serialized_data is user-controlled
    resume_obj = pickle.loads(serialized_data)
    return resume_obj

# 3. PYTHON BUG: Mutable Default Argument
def append_user_preference(pref, current_list=[]):
    # Bug: current_list persists across invocations because default list is created once
    current_list.append(pref)
    return current_list

# 4. RESOURCE LEAK: Unclosed file handle
def read_configuration_file(file_path):
    # Bug: File is never closed, should use 'with open(...) as f:'
    f = open(file_path, "r")
    content = f.read()
    return content
